import Star from "./Star";

export default {
  title: "Atoms/Star",
  component: Star,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const defaultStar = {
  args: {
    starCount: "0.0",
    reviewCount: 0,
  },
};
