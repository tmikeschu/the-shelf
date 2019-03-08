import { updateElement, capitalize, targVal, setFormData } from "./utils";

describe("updateElement", () => {
  it("takes a list of xs, an index, and a setter function", () => {
    const xs = [1, 2, 3];
    const actual = updateElement(xs)(1, x => x * 2);
    const expected = [1, 4, 3];
    expect(actual).toEqual(expected);
  });

  it("takes a value instead of a setter", () => {
    const xs = [1, 2, 3];
    const actual = updateElement(xs)(1, 10);
    const expected = [1, 10, 3];
    expect(actual).toEqual(expected);
  });
});

describe("capitalize", () => {
  it("capitalizes a string", () => {
    const actual = capitalize("me");
    const expected = "Me";
    expect(actual).toEqual(expected);
  });

  it("capitalizes a all upper", () => {
    const actual = capitalize("ME");
    const expected = "Me";
    expect(actual).toEqual(expected);
  });
});

describe("targVal", () => {
  it("takes a callback and gets the value off an event-like object", () => {
    const event = {
      target: {
        value: "Harry Potte"
      }
    };
    const actual = targVal(x => x === "Harry Potte")(event);
    expect(actual).toBe(true);
  });
});

describe("setFormData", () => {
  it("takes prop data and and object and calls the each setter with the item value", () => {
    let name;
    let age;
    const props = {
      name: {
        setter: x => {
          name = x;
        }
      },
      age: {
        setter: x => {
          age = x;
        }
      }
    };
    const item = {
      name: "Harry Potter",
      age: 22
    };
    setFormData(props, item);
    expect(name).toEqual("Harry Potter");
    expect(age).toEqual(22);
  });
});
