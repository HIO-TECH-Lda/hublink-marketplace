import Ticket, { ITicketDocument } from '../models/Ticket';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import { ITicket, ITicketMessage, ITicketAttachment, TicketStatus, TicketCategory, TicketPriority } from '../types';
import { uploadBase64Image, deleteImage } from '../utils/cloudinary';
import Messages from '../utils/messages';

export interface CreateTicketData {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  orderId?: string;
  productId?: string;
  tags?: string[];
  attachments?: Array<{ fileName: string; fileUrl: string; fileSize: number; mimeType: string }>;
}

export interface UpdateTicketData {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
  tags?: string[];
}

export interface AddMessageData {
  message: string;
  isInternal?: boolean;
  attachments?: Array<{ fileName: string; fileUrl: string; fileSize: number; mimeType: string }>;
}

export interface TicketListResponse {
  tickets: ITicket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TicketStatistics {
  total: number;
  byStatus: Record<TicketStatus, number>;
  byCategory: Record<TicketCategory, number>;
  byPriority: Record<TicketPriority, number>;
  averageResponseTime: number;
  averageResolutionTime: number;
}

export class TicketService {
  /**
   * Create a new ticket
   */
  static async createTicket(userId: string, userType: 'buyer' | 'seller' | 'admin', data: CreateTicketData): Promise<ITicketDocument> {
    try {
      // Validate orderId belongs to user if provided
      if (data.orderId) {
        const order = await Order.findOne({ _id: data.orderId, userId });
        if (!order) {
          throw new Error(Messages.TICKET.ORDER_NOT_BELONG);
        }
      }

      // Validate productId exists if provided
      if (data.productId) {
        const product = await Product.findById(data.productId);
        if (!product) {
          throw new Error('Product not found');
        }
      }

      // Create ticket
      const ticket = new Ticket({
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        status: 'open',
        userId,
        userType,
        orderId: data.orderId,
        productId: data.productId,
        tags: data.tags || [],
        attachments: [],
        messages: []
      });

      // Map attachments to include ticketId
      if (data.attachments && data.attachments.length > 0) {
        ticket.attachments = data.attachments.map(att => ({
          ticketId: ticket._id.toString(),
          fileName: att.fileName,
          fileUrl: att.fileUrl,
          fileSize: att.fileSize,
          mimeType: att.mimeType,
          uploadedAt: new Date()
        }));
      }

      // Create initial message with ticket description
      ticket.messages.push({
        ticketId: ticket._id,
        userId,
        userType,
        message: data.description,
        isInternal: false,
        attachments: []
      });

      await ticket.save();

      // Populate references
      await ticket.populate('userId', 'firstName lastName email');
      if (ticket.orderId) {
        await ticket.populate('orderId', 'orderNumber');
      }
      if (ticket.productId) {
        await ticket.populate('productId', 'name primaryImage');
      }
      if (ticket.assignedTo) {
        await ticket.populate('assignedTo', 'firstName lastName email');
      }

      return ticket;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user's tickets
   */
  static async getUserTickets(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      status?: TicketStatus;
      category?: TicketCategory;
      priority?: TicketPriority;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<TicketListResponse> {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        category,
        priority,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      const query: any = { userId };

      if (status) query.status = status;
      if (category) query.category = category;
      if (priority) query.priority = priority;
      if (search) {
        query.$text = { $search: search };
      }

      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const tickets = await Ticket.find(query)
        .populate('userId', 'firstName lastName email')
        .populate('assignedTo', 'firstName lastName email')
        .populate('orderId', 'orderNumber')
        .populate('productId', 'name primaryImage')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      // Filter out internal messages for non-admin users
      const user = await User.findById(userId);
      const isAdmin = user?.role === 'admin' || user?.role === 'support';
      
      const filteredTickets = tickets.map((ticket: any) => {
        if (!isAdmin) {
          ticket.messages = ticket.messages.filter((msg: any) => !msg.isInternal);
        }
        return ticket;
      });

      const total = await Ticket.countDocuments(query);

      return {
        tickets: filteredTickets as ITicket[],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get single ticket by ID
   */
  static async getTicketById(ticketId: string, userId: string, userRole: string): Promise<ITicketDocument | null> {
    try {
      const ticket = await Ticket.findById(ticketId)
        .populate('userId', 'firstName lastName email')
        .populate('assignedTo', 'firstName lastName email')
        .populate('orderId', 'orderNumber')
        .populate('productId', 'name primaryImage');

      if (!ticket) {
        return null;
      }

      // Check authorization
      const isAdmin = userRole === 'admin' || userRole === 'support';
      const isOwner = (ticket.userId as any)._id?.toString() === userId || ticket.userId.toString() === userId;
      
      // Allow access if user is admin/support OR if user is the ticket owner
      if (!isAdmin && !isOwner) {
        throw new Error(Messages.TICKET.NO_PERMISSION);
      }

      // Filter out internal messages for non-admin users
      if (!isAdmin) {
        ticket.messages = ticket.messages.filter(msg => !msg.isInternal);
      }

      return ticket;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update ticket
   */
  static async updateTicket(
    ticketId: string,
    userId: string,
    userRole: string,
    data: UpdateTicketData
  ): Promise<ITicketDocument> {
    try {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        throw new Error(Messages.TICKET.NOT_FOUND);
      }

      // Only admins/support can update tickets
      const isAdmin = userRole === 'admin' || userRole === 'support';
      if (!isAdmin) {
        throw new Error('You do not have permission to update this ticket');
      }

      // Validate assignedTo if provided
      if (data.assignedTo) {
        const assignedUser = await User.findById(data.assignedTo);
        if (!assignedUser || (assignedUser.role !== 'admin' && assignedUser.role !== 'support')) {
          throw new Error(Messages.TICKET.ASSIGNED_MUST_BE_ADMIN);
        }
      }

      // Update fields
      if (data.status !== undefined) ticket.status = data.status;
      if (data.priority !== undefined) ticket.priority = data.priority;
      if (data.assignedTo !== undefined) ticket.assignedTo = data.assignedTo as any;
      if (data.tags !== undefined) ticket.tags = data.tags;

      await ticket.save();

      await ticket.populate('userId', 'firstName lastName email');
      await ticket.populate('assignedTo', 'firstName lastName email');
      await ticket.populate('orderId', 'orderNumber');
      await ticket.populate('productId', 'name primaryImage');

      return ticket;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add message to ticket
   */
  static async addMessage(
    ticketId: string,
    userId: string,
    userType: 'buyer' | 'seller' | 'admin' | 'support',
    data: AddMessageData
  ): Promise<ITicketDocument> {
    try {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        throw new Error(Messages.TICKET.NOT_FOUND);
      }

      // Check authorization
      const isAdmin = userType === 'admin' || userType === 'support';
      if (!isAdmin && ticket.userId.toString() !== userId) {
        throw new Error('You do not have permission to add messages to this ticket');
      }

      // Cannot add messages to closed tickets (unless admin)
      if (ticket.status === 'closed' && !isAdmin) {
        throw new Error('Cannot add messages to closed tickets');
      }

      // Only admins/support can set isInternal
      const isInternal = isAdmin && data.isInternal === true;

      // Add message
      const newMessage: any = {
        ticketId: ticket._id,
        userId,
        userType,
        message: data.message,
        isInternal,
        attachments: []
      };
      
      ticket.messages.push(newMessage);
      
      // Get the message ID after it's been pushed (Mongoose assigns _id)
      const messageId = newMessage._id?.toString();
      
      // Map attachments to include ticketId and messageId
      if (data.attachments && data.attachments.length > 0) {
        newMessage.attachments = data.attachments.map(att => ({
          ticketId: ticket._id.toString(),
          messageId: messageId,
          fileName: att.fileName,
          fileUrl: att.fileUrl,
          fileSize: att.fileSize,
          mimeType: att.mimeType,
          uploadedAt: new Date()
        }));
      }

      // Auto-update status based on who sent the message
      if (!isAdmin) {
        // User sent message
        if (ticket.status === 'in_progress' || ticket.status === 'waiting_for_user') {
          ticket.status = 'waiting_for_user';
        }
      } else {
        // Support sent message
        if (ticket.status === 'open' || ticket.status === 'waiting_for_user') {
          ticket.status = 'in_progress';
        }
      }

      await ticket.save();

      await ticket.populate('userId', 'firstName lastName email');
      await ticket.populate('assignedTo', 'firstName lastName email');
      await ticket.populate('orderId', 'orderNumber');
      await ticket.populate('productId', 'name primaryImage');

      return ticket;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all tickets (admin/support only)
   */
  static async getAllTickets(
    options: {
      page?: number;
      limit?: number;
      status?: TicketStatus;
      category?: TicketCategory;
      priority?: TicketPriority;
      assignedTo?: string;
      userId?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<TicketListResponse> {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        category,
        priority,
        assignedTo,
        userId,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      const query: any = {};

      if (status) query.status = status;
      if (category) query.category = category;
      if (priority) query.priority = priority;
      if (assignedTo) query.assignedTo = assignedTo;
      if (userId) query.userId = userId;
      if (search) {
        query.$text = { $search: search };
      }

      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const tickets = await Ticket.find(query)
        .populate('userId', 'firstName lastName email')
        .populate('assignedTo', 'firstName lastName email')
        .populate('orderId', 'orderNumber')
        .populate('productId', 'name primaryImage')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const total = await Ticket.countDocuments(query);

      return {
        tickets: tickets as ITicket[],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get ticket statistics
   */
  static async getTicketStatistics(options: {
    startDate?: Date;
    endDate?: Date;
    category?: TicketCategory;
    assignedTo?: string;
  } = {}): Promise<TicketStatistics> {
    try {
      const { startDate, endDate, category, assignedTo } = options;

      const matchQuery: any = {};
      if (startDate || endDate) {
        matchQuery.createdAt = {};
        if (startDate) matchQuery.createdAt.$gte = startDate;
        if (endDate) matchQuery.createdAt.$lte = endDate;
      }
      if (category) matchQuery.category = category;
      if (assignedTo) matchQuery.assignedTo = assignedTo;

      const [byStatus, byCategory, byPriority, total] = await Promise.all([
        Ticket.aggregate([
          { $match: matchQuery },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        Ticket.aggregate([
          { $match: matchQuery },
          { $group: { _id: '$category', count: { $sum: 1 } } }
        ]),
        Ticket.aggregate([
          { $match: matchQuery },
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]),
        Ticket.countDocuments(matchQuery)
      ]);

      const statusMap: Record<TicketStatus, number> = {
        open: 0,
        in_progress: 0,
        waiting_for_user: 0,
        waiting_for_third_party: 0,
        resolved: 0,
        closed: 0
      };
      byStatus.forEach((item: any) => {
        statusMap[item._id as TicketStatus] = item.count;
      });

      const categoryMap: Record<TicketCategory, number> = {
        technical_issue: 0,
        payment_problem: 0,
        order_issue: 0,
        return_request: 0,
        account_issue: 0,
        product_issue: 0,
        shipping_problem: 0,
        general_inquiry: 0,
        feature_request: 0,
        bug_report: 0
      };
      byCategory.forEach((item: any) => {
        categoryMap[item._id as TicketCategory] = item.count;
      });

      const priorityMap: Record<TicketPriority, number> = {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
      };
      byPriority.forEach((item: any) => {
        priorityMap[item._id as TicketPriority] = item.count;
      });

      // Calculate average response time and resolution time (simplified)
      const averageResponseTime = 3600; // Placeholder - would need to track first response time
      const averageResolutionTime = 86400; // Placeholder - would need to track resolution time

      return {
        total,
        byStatus: statusMap,
        byCategory: categoryMap,
        byPriority: priorityMap,
        averageResponseTime,
        averageResolutionTime
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete ticket (soft delete recommended)
   */
  static async deleteTicket(ticketId: string): Promise<void> {
    try {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        throw new Error(Messages.TICKET.NOT_FOUND);
      }

      // Delete attachments from Cloudinary
      for (const attachment of ticket.attachments) {
        if (attachment.publicId) {
          await deleteImage(attachment.publicId);
        }
      }

      for (const message of ticket.messages) {
        if (message.attachments) {
          for (const attachment of message.attachments) {
            if (attachment.publicId) {
              await deleteImage(attachment.publicId);
            }
          }
        }
      }

      await Ticket.findByIdAndDelete(ticketId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload attachment to ticket
   */
  static async uploadTicketAttachment(
    ticketId: string,
    fileData: { fileName: string; fileSize: number; mimeType: string; base64: string },
    messageId?: string
  ): Promise<ITicketAttachment> {
    try {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        throw new Error(Messages.TICKET.NOT_FOUND);
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (fileData.fileSize > maxSize) {
        throw new Error(Messages.TICKET.FILE_SIZE_EXCEEDED);
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(fileData.mimeType)) {
        throw new Error(Messages.TICKET.INVALID_FILE_TYPE);
      }

      // Upload to Cloudinary
      const uploaded = await uploadBase64Image(fileData.base64, 'tickets/attachments');

      const attachment = {
        ticketId: ticket._id.toString(),
        messageId: messageId,
        fileName: fileData.fileName,
        fileUrl: uploaded.url,
        publicId: uploaded.publicId,
        fileSize: fileData.fileSize,
        mimeType: fileData.mimeType,
        uploadedAt: new Date()
      };

      if (messageId) {
        // Add to message
        const message = ticket.messages.find((msg: any) => msg._id?.toString() === messageId);
        if (!message) {
          throw new Error('Message not found');
        }
        if (!message.attachments) {
          message.attachments = [];
        }
        message.attachments.push(attachment);
      } else {
        // Add to ticket
        ticket.attachments.push(attachment);
      }

      await ticket.save();

      return attachment as ITicketAttachment;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete attachment
   */
  static async deleteAttachment(ticketId: string, attachmentId: string, userId: string, userRole: string): Promise<void> {
    try {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        throw new Error(Messages.TICKET.NOT_FOUND);
      }

      const isAdmin = userRole === 'admin' || userRole === 'support';

      // Find and remove attachment from ticket
      let attachment = ticket.attachments.find((att: any) => att._id?.toString() === attachmentId);
      if (attachment) {
        if (!isAdmin && ticket.userId.toString() !== userId) {
          throw new Error('You do not have permission to delete this attachment');
        }
        if (attachment.publicId) {
          await deleteImage(attachment.publicId);
        }
        ticket.attachments = ticket.attachments.filter((att: any) => att._id?.toString() !== attachmentId);
        await ticket.save();
        return;
      }

      // Find and remove attachment from message
      for (const message of ticket.messages) {
        if (!message.attachments) continue;
        attachment = message.attachments.find((att: any) => att._id?.toString() === attachmentId);
        if (attachment) {
          if (!isAdmin && ticket.userId.toString() !== userId) {
            throw new Error('You do not have permission to delete this attachment');
          }
          if (attachment.publicId) {
            await deleteImage(attachment.publicId);
          }
          message.attachments = message.attachments.filter((att: any) => att._id?.toString() !== attachmentId);
          await ticket.save();
          return;
        }
      }

      throw new Error(Messages.TICKET.ATTACHMENT_NOT_FOUND);
    } catch (error) {
      throw error;
    }
  }
}

