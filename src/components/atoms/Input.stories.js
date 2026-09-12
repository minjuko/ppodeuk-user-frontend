import TextInput from "./TextInput";

export default {
  title: "Atoms/Input",
  component: TextInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const email = {
  args: {
    placeholder: "이메일",
  },
};

export const password = {
  args: {
    placeholder: "비밀번호",
  },
};
