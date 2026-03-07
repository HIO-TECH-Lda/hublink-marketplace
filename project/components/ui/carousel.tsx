'use client';

import * as React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type CarouselApi = { scrollPrev: () => void; scrollNext: () => void; canScrollPrev: boolean; canScrollNext: boolean };

type CarouselProps = {
  opts?: { loop?: boolean; align?: string };
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
  /** Enable autoplay. Pass `{ delay: 5000 }` to customize. */
  autoplay?: boolean | { delay?: number };
};

type CarouselContextProps = {
  currentIndex: number;
  totalSlides: number;
  setTotalSlides: (n: number) => void;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: 'horizontal' | 'vertical';
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error('useCarousel must be used within a <Carousel />');
  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = 'horizontal',
      opts,
      setApi,
      autoplay,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [totalSlides, setTotalSlidesState] = React.useState(0);
    const loop = opts?.loop !== false;

    const setTotalSlides = React.useCallback((n: number) => {
      setTotalSlidesState((prev) => (n >= 0 ? n : prev));
    }, []);

    const scrollPrev = React.useCallback(() => {
      setCurrentIndex((i) => (totalSlides > 0 ? (loop ? (i - 1 + totalSlides) % totalSlides : Math.max(0, i - 1)) : 0));
    }, [totalSlides, loop]);

    const scrollNext = React.useCallback(() => {
      setCurrentIndex((i) => (totalSlides > 0 ? (loop ? (i + 1) % totalSlides : Math.min(totalSlides - 1, i + 1)) : 0));
    }, [totalSlides, loop]);

    const canScrollPrev = loop || currentIndex > 0;
    const canScrollNext = loop || currentIndex < totalSlides - 1;

    const api = React.useMemo<CarouselApi>(
      () => ({ scrollPrev, scrollNext, canScrollPrev, canScrollNext }),
      [scrollPrev, scrollNext, canScrollPrev, canScrollNext]
    );

    React.useEffect(() => {
      if (setApi) setApi(api);
    }, [setApi, api]);

    // Autoplay
    const delay = typeof autoplay === 'object' && autoplay?.delay != null ? autoplay.delay : 5000;
    React.useEffect(() => {
      if (!autoplay || totalSlides <= 1) return;
      const id = setInterval(scrollNext, delay);
      return () => clearInterval(id);
    }, [autoplay, delay, totalSlides, scrollNext]);

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          scrollPrev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    return (
      <CarouselContext.Provider
        value={{
          currentIndex,
          totalSlides,
          setTotalSlides,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          orientation,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative', className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { currentIndex, totalSlides, setTotalSlides, orientation } = useCarousel();
  const count = React.Children.count(children);

  React.useEffect(() => {
    setTotalSlides(count);
  }, [count, setTotalSlides]);

  const isHorizontal = orientation === 'horizontal';
  const slidePercent = totalSlides > 0 ? 100 / totalSlides : 100;
  const translate = totalSlides > 0 ? -currentIndex * slidePercent : 0;

  return (
    <div className="overflow-hidden" ref={ref}>
      <div
        className={cn(
          'flex transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
          isHorizontal ? '-ml-4' : '-mt-4 flex-col',
          className
        )}
        style={
          isHorizontal
            ? {
                width: `${totalSlides * 100}%`,
                transform: `translateX(${translate}%)`,
                transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
              }
            : {
                height: `${totalSlides * 100}%`,
                transform: `translateY(${translate}%)`,
                transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
              }
        }
        {...props}
      >
        {React.Children.map(children, (child) => (
          <div
            style={{
              flex: `0 0 ${slidePercent}%`,
              minWidth: 0,
            }}
            className={isHorizontal ? 'pl-4' : 'pt-4'}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
});
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn('min-w-0 h-full', className)}
      {...props}
    />
  );
});
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  const isHorizontal = orientation === 'horizontal';

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute h-8 w-8 rounded-full',
        isHorizontal
          ? '-left-12 top-1/2 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  const isHorizontal = orientation === 'horizontal';

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute h-8 w-8 rounded-full',
        isHorizontal
          ? '-right-12 top-1/2 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = 'CarouselNext';

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
