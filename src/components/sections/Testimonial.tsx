import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { QuoteIcon } from "@/components/ui/icons";
import { stats, testimonial } from "@/content";

/** Testimonial + stats (Figma 2:305 desktop, 2:4471 mobile). */
export function Testimonial() {
  return (
    <section aria-label="What learners say" className="bg-background-white py-15 lg:py-[100px]">
      <Container className="flex flex-col gap-14 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <figure className="flex max-w-[600px] flex-col lg:flex-1">
          <QuoteIcon className="h-[22px] w-6 text-primary-blue" />
          <blockquote className="pt-4 text-quote text-text-primary">
            <p>{testimonial.quote}</p>
          </blockquote>
          <figcaption className="flex items-center gap-4 pt-8">
            <Image
              src={testimonial.avatar.src}
              alt={testimonial.avatar.alt}
              width={48}
              height={48}
              sizes="48px"
              className="size-12 rounded-full bg-primary-blue-light object-cover"
            />
            <span className="flex flex-col">
              <span className="text-base leading-7 font-bold text-text-primary">
                {testimonial.name}
              </span>
              <span className="text-sm leading-6 text-text-secondary">{testimonial.role}</span>
            </span>
          </figcaption>
        </figure>

        <ul
          aria-label="Luma in numbers"
          className="grid grid-cols-3 gap-4 lg:w-[401px] lg:shrink-0 lg:grid-cols-1 lg:gap-5 lg:border-l lg:border-line-1 lg:pl-12"
        >
          {stats.map((stat) => (
            <li key={stat.label} className="flex flex-col">
              <span className="text-h1 text-primary-blue">{stat.value}</span>
              <span className="pt-1 text-sm leading-6 text-text-tertiary lg:h-[25px]">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
