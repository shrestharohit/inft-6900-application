import { Tooltip } from "@mui/material";

export const truncateText = (text) => {
  const truncatedText = text?.length > 40 ? text.slice(0, 40) + "..." : text;

  return (
    <Tooltip title={text} placement="top" >
      <span>{truncatedText}</span>
    </Tooltip>
  );
};
