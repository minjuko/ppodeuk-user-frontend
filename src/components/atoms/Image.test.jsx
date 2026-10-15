import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Image from "./Image";

describe("Image", () => {
  it("replaces a failed remote image with the local fallback", () => {
    render(<Image src="https://example.com/missing.jpg" alt="세차장" />);

    const image = screen.getByAltText("세차장");
    fireEvent.error(image);

    expect(image).toHaveAttribute(
      "src",
      "/CarwashDetail/CarwashImgNotFound.png",
    );
  });

  it("does not loop when the fallback image also fails", () => {
    render(
      <Image src="/missing.jpg" alt="세차장" fallbackSrc="/fallback.jpg" />,
    );

    const image = screen.getByAltText("세차장");
    fireEvent.error(image);
    expect(image).toHaveAttribute("src", "/fallback.jpg");

    fireEvent.error(image);
    expect(image).toHaveAttribute("src", "/fallback.jpg");
  });
});
