import { ChevronLeft } from "@mui/icons-material";
import { ButtonType } from "../../types";

interface TableProps {
  text: string;
  styleType: ButtonType;
  type?: "submit" | "reset" | "button" | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  functionality?: "back";
}

export const Button = ({
  text,
  type = "button",
  styleType,
  onClick,
  functionality,
}: TableProps) => {
  return (
    <button type={type} className={styleType} onClick={onClick}>
      {functionality === "back" && <ChevronLeft />}
      {text}
    </button>
  );
};
