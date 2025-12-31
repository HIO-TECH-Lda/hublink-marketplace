import Ticket from '../models/Ticket';
import User from '../models/User';
import mongoose from 'mongoose';

export class AdminTicketService {
  // Get ticket statistics
  static async getTicketStats(): Promise<any> {
    try {
      const [
        total,
        open,
        inProgress,
        urgent
      ] = await Promise.all([
        Ticket.countDocuments(),
        Ticket.countDocuments({ status: 'open' }),
        Ticket.countDocuments({ status: 'in_progress' }),
        Ticket.countDocuments({ priority: 'urgent', status: { $ne: 'closed' } })
      ]);

      return {
        total,
        open,
        inProgress,
        waitingForUser: await Ticket.countDocuments({ status: 'waiting_for_user' }),
        waitingForThirdParty: await Ticket.countDocuments({ status: 'waiting_for_third_party' }),
        resolved: await Ticket.countDocuments({ status: 'resolved' }),
        closed: await Ticket.countDocuments({ status: 'closed' }),
        urgent,
        high: await Ticket.countDocuments({ priority: 'high', status: { $ne: 'closed' } }),
        medium: await Ticket.countDocuments({ priority: 'medium', status: { $ne: 'closed' } }),
        low: await Ticket.countDocuments({ priority: 'low', status: { $ne: 'closed' } })
      };
    } catch (error) {
      throw new Error(
        `Failed to get ticket statistics: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get all tickets with filters
  static async getTickets(filters: {
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
    assignedTo?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<any> {
    try {
      const {
        search,
        status,
        priority,
        category,
        assignedTo,
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = filters;

      const query: any = {};

      // Search filter
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { 'ticketNumber': { $regex: search, $options: 'i' } }
        ];
      }

      // Status filter
      if (status && status !== 'all') {
        query.status = status;
      }

      // Priority filter
      if (priority && priority !== 'all') {
        query.priority = priority;
      }

      // Category filter
      if (category && category !== 'all') {
        query.category = category;
      }

      // Assigned to filter
      if (assignedTo && assignedTo !== 'all') {
        query.assignedTo = assignedTo;
      }

      const skip = (page - 1) * limit;
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const [tickets, total] = await Promise.all([
        Ticket.find(query)
          .populate('userId', 'firstName lastName email')
          .populate('assignedTo', 'firstName lastName email')
          .populate('orderId', 'orderNumber')
          .populate('productId', 'name primaryImage')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        Ticket.countDocuments(query)
      ]);

      return {
        tickets: tickets.map((ticket: any) => ({
          id: ticket._id.toString(),
          ticketNumber: ticket.ticketNumber || `TICK-${ticket._id.toString().slice(-3).toUpperCase()}`,
          title: ticket.title,
          description: ticket.description,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status,
          createdBy: ticket.userId ? {
            id: ticket.userId._id.toString(),
            name: `${ticket.userId.firstName || ''} ${ticket.userId.lastName || ''}`.trim() || ticket.userId.email
          } : null,
          assignedTo: ticket.assignedTo ? {
            id: ticket.assignedTo._id.toString(),
            name: `${ticket.assignedTo.firstName || ''} ${ticket.assignedTo.lastName || ''}`.trim() || ticket.assignedTo.email
          } : null,
          orderId: ticket.orderId ? {
            id: ticket.orderId._id.toString(),
            orderNumber: ticket.orderId.orderNumber
          } : null,
          productId: ticket.productId ? {
            id: ticket.productId._id.toString(),
            name: ticket.productId.name
          } : null,
          tags: ticket.tags || [],
          messageCount: ticket.messages?.length || 0,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(
        `Failed to get tickets: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get ticket by ID with full details
  static async getTicketById(ticketId: string): Promise<any> {
    try {
      const ticket = await Ticket.findById(ticketId)
        .populate('userId', 'firstName lastName email phone')
        .populate('assignedTo', 'firstName lastName email')
        .populate('orderId', 'orderNumber status totalAmount')
        .populate('productId', 'name primaryImage slug')
        .lean();

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      // Separate public and internal messages
      const publicMessages = (ticket.messages || [])
        .filter((msg: any) => !msg.isInternal)
        .map((msg: any) => ({
          id: msg._id.toString(),
          userId: msg.userId?.toString(),
          userType: msg.userType,
          message: msg.message,
          isInternal: false,
          attachments: msg.attachments || [],
          createdAt: msg.createdAt
        }));

      const internalMessages = (ticket.messages || [])
        .filter((msg: any) => msg.isInternal)
        .map((msg: any) => ({
          id: msg._id.toString(),
          userId: msg.userId?.toString(),
          userType: msg.userType,
          message: msg.message,
          isInternal: true,
          attachments: msg.attachments || [],
          createdAt: msg.createdAt
        }));

      // Calculate statistics
      const messageCount = (ticket.messages || []).length;
      const timeOpen = ticket.status !== 'closed' && ticket.status !== 'resolved'
        ? Math.floor((Date.now() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : null;
      const lastUpdate = ticket.updatedAt || ticket.createdAt;

      return {
        id: ticket._id.toString(),
        ticketNumber: ticket.ticketNumber || `TICK-${ticket._id.toString().slice(-3).toUpperCase()}`,
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        createdBy: ticket.userId ? {
          id: ticket.userId._id.toString(),
          name: `${ticket.userId.firstName || ''} ${ticket.userId.lastName || ''}`.trim() || ticket.userId.email,
          email: ticket.userId.email,
          phone: ticket.userId.phone || null
        } : null,
        assignedTo: ticket.assignedTo ? {
          id: ticket.assignedTo._id.toString(),
          name: `${ticket.assignedTo.firstName || ''} ${ticket.assignedTo.lastName || ''}`.trim() || ticket.assignedTo.email,
          email: ticket.assignedTo.email
        } : null,
        orderId: ticket.orderId ? {
          id: ticket.orderId._id.toString(),
          orderNumber: ticket.orderId.orderNumber,
          status: ticket.orderId.status,
          totalAmount: ticket.orderId.totalAmount
        } : null,
        productId: ticket.productId ? {
          id: ticket.productId._id.toString(),
          name: ticket.productId.name,
          image: ticket.productId.primaryImage,
          slug: ticket.productId.slug
        } : null,
        tags: ticket.tags || [],
        attachments: ticket.attachments || [],
        messages: {
          public: publicMessages,
          internal: internalMessages,
          all: [...publicMessages, ...internalMessages].sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        },
        stats: {
          messageCount,
          timeOpen,
          lastUpdate
        },
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
      };
    } catch (error) {
      throw new Error(
        `Failed to get ticket: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Update ticket
  static async updateTicket(ticketId: string, updateData: any): Promise<any> {
    try {
      const ticket = await Ticket.findById(ticketId);

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      // Update fields
      Object.keys(updateData).forEach(key => {
        if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'messages') {
          (ticket as any)[key] = updateData[key];
        }
      });

      await ticket.save();
      return await this.getTicketById(ticketId);
    } catch (error) {
      throw new Error(
        `Failed to update ticket: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Update ticket status (quick action)
  static async updateTicketStatus(ticketId: string, status: string): Promise<any> {
    try {
      const ticket = await Ticket.findById(ticketId);

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      ticket.status = status as any;
      await ticket.save();

      return await this.getTicketById(ticketId);
    } catch (error) {
      throw new Error(
        `Failed to update ticket status: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Assign ticket to user
  static async assignTicket(ticketId: string, userId: string): Promise<any> {
    try {
      const ticket = await Ticket.findById(ticketId);

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      // Verify user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      ticket.assignedTo = new mongoose.Types.ObjectId(userId);
      await ticket.save();

      return await this.getTicketById(ticketId);
    } catch (error) {
      throw new Error(
        `Failed to assign ticket: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Add message to ticket
  static async addMessage(ticketId: string, userId: string, userType: string, messageData: {
    message: string;
    isInternal?: boolean;
    attachments?: any[];
  }): Promise<any> {
    try {
      const ticket = await Ticket.findById(ticketId);

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      const newMessage = {
        ticketId: ticket._id,
        userId: new mongoose.Types.ObjectId(userId),
        userType: userType as any,
        message: messageData.message,
        isInternal: messageData.isInternal || false,
        attachments: messageData.attachments || [],
        createdAt: new Date()
      };

      ticket.messages.push(newMessage as any);
      await ticket.save();

      return await this.getTicketById(ticketId);
    } catch (error) {
      throw new Error(
        `Failed to add message: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Delete ticket
  static async deleteTicket(ticketId: string): Promise<void> {
    try {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        throw new Error('Ticket not found');
      }

      await Ticket.findByIdAndDelete(ticketId);
    } catch (error) {
      throw new Error(
        `Failed to delete ticket: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

