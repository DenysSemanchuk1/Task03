import { Button, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
export const ImageViewer = ({ src, onClose }) => {
  return (
    <Modal
      open={true}
      onClose={onClose}
      style={{
        overflow: "scroll",
        height: "100%",
        display: "block",
      }}
    >
      <div>
        <Button
          onClick={onClose}
          style={{ position: "fixed", top: 20, right: 20, background: "#fff" }}
        >
          <CloseIcon />
        </Button>
        <img
          src={src}
          alt='page thumbnail'
          style={{
            width: "80%",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>
    </Modal>
  );
};
