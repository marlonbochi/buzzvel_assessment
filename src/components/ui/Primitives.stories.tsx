import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { avatars } from "@/content/avatars";
import { AvatarStack } from "./AvatarStack";
import { Chip } from "./Chip";
import { Eyebrow } from "./Eyebrow";
import {
  ArrowRightIcon,
  ChatIcon,
  ClockIcon,
  CloseIcon,
  MenuIcon,
  QuoteIcon,
  StarIcon,
} from "./icons";
import { SectionHeading } from "./SectionHeading";

const meta = { title: "UI/Primitives" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Chips: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex gap-3">
        <Chip>01</Chip>
        <Chip>02</Chip>
      </div>
      <ul className="flex gap-3 bg-primary-blue p-6">
        {["8 lessons", "2h 40min", "Intermediate"].map((item) => (
          <li key={item}>
            <Chip tone="outline-white">{item}</Chip>
          </li>
        ))}
      </ul>
    </div>
  ),
};

export const Eyebrows: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="p-8">
        <Eyebrow>Learn at your own pace</Eyebrow>
      </div>
      <div className="bg-primary-blue p-8">
        <Eyebrow tone="white">Most popular this month</Eyebrow>
      </div>
    </div>
  ),
};

export const Headings: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      <div className="p-8">
        <SectionHeading
          id="story-left"
          eyebrow="Find your next skill"
          title="Learn something worth knowing."
          description="Short, practical courses designed around skills you can put to work immediately."
        />
      </div>
      <div className="bg-background-light-yellow p-8">
        <SectionHeading
          id="story-center"
          align="center"
          eyebrow="How Luma works"
          title="Less browsing. More learning."
        />
      </div>
      <div className="bg-primary-blue p-8">
        <SectionHeading
          id="story-light"
          tone="light"
          size="h3"
          eyebrow="Most popular this month"
          title="Designing products people understand."
        />
      </div>
    </div>
  ),
};

export const Avatars: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="bg-background-light-yellow p-8">
        <AvatarStack avatars={[avatars.maya, avatars.daniel, avatars.arjun]} />
      </div>
      <div className="bg-background-yellow p-8">
        <AvatarStack
          avatars={[avatars.maya, avatars.daniel, avatars.arjun, avatars.sofia]}
          size={40}
          ring="yellow"
        />
      </div>
    </div>
  ),
};

export const Icons: Story = {
  render: () => (
    <ul className="flex flex-wrap items-center gap-6 p-8 text-text-primary">
      {[MenuIcon, CloseIcon, ArrowRightIcon, ChatIcon, ClockIcon].map((Icon) => (
        <li key={Icon.name}>
          <Icon />
        </li>
      ))}
      <li className="text-secondary-yellow">
        <StarIcon />
      </li>
      <li className="text-primary-blue">
        <QuoteIcon />
      </li>
    </ul>
  ),
};
