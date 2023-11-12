import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import Draggable from "react-draggable";
import html2canvas from "html2canvas";
import { Canvas } from "../Canvas";
import {
  Button,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import UndoIcon from "@mui/icons-material/Undo";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";

import styles from "./styles.module.scss";
import renderStepContent from "./utils/renderStepContent";
import { ImageViewer } from "../ImageViewer/ImageViewer";

const steps = ["Mark errors", "Describe errors", "Review"];

const MultistepForm = () => {
  const [step, setStep] = useState(0);
  const [screenshot, setScreenshot] = useState("");
  const [allowedToDraw, setAllowedToDraw] = useState(false);
  const canvasRef = useRef(null);
  const modalRef = useRef(null);
  const ctxRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [undoIndex, setUndoIndex] = useState(-1);

  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const handleKeyboardShortcuts = (e) => {
      if (e.ctrlKey && e.key === "z") {
        undoLastChange();
      } else if (e.ctrlKey && e.key === "m") {
        setAllowedToDraw((bool) => !bool);
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcuts);
    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcuts);
    };
  }, []);

  const onSubmit = (data) => {
    console.log(data);
    reset();
    setStep(0);
    setScreenshot("");
  };

  const takeScreenshot = () => {
    html2canvas(document.body, {
      logging: false
    }).then((image) => {
      const dataURL = image.toDataURL();
      setScreenshot(dataURL);
      clearCanvas();
      setAllowedToDraw(false);
    });
  };

  const isStepOptional = (step) => {
    return step === 1;
  };

  const onPrev = () => {
    setStep((step) => step - 1);
  };

  const undoLastChange = () => {
    if (undoIndex <= 0) {
      clearCanvas();
    } else {
      setUndoIndex(undoIndex - 1);
      ctxRef.current.putImageData(history[undoIndex - 1], 0, 0);
      setHistory((history) => history[undoIndex - 1]);
    }
  };

  const clearCanvas = () => {
    const context = ctxRef.current;
    const canvas = canvasRef.current;
    context.fillStyle = "rgba(0,0,0,0.4)";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);

    setHistory([]);
    setUndoIndex(-1);
  };

  return (
    <div>
      {isViewerOpen && <ImageViewer src={screenshot} onClose={() => setIsViewerOpen(false)}/>}
      <Canvas
        undoIndex={undoIndex}
        setUndoIndex={setUndoIndex}
        setHistory={setHistory}
        canvasRef={canvasRef}
        allowedToDraw={allowedToDraw}
        ctxRef={ctxRef}
      />
      <Draggable bounds='body' handle='.handle'>
        <div ref={modalRef} className={styles.modal}>
          <div className={`${styles.panel} handle`}>
            <DragIndicatorIcon fontSize='large' style={{ color: "#fff" }} />
            <Button style={{ background: "#fff" }}>
              <CloseIcon />
            </Button>
          </div>
          <div className={styles.modalInner}>
            <Stepper activeStep={step}>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                if (isStepOptional(index)) {
                  labelProps.optional = (
                    <Typography variant='caption'>Optional</Typography>
                  );
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>

            {renderStepContent(
              step,
              register,
              errors,
              screenshot,
              setIsViewerOpen
            )}

            <div className={styles.bottomPanel}>
              {step > 0 && (
                <Tooltip title='Go to the Previous Step' arrow>
                  <Button
                    className={styles.prevBtn}
                    type='button'
                    variant='outlined'
                    onClick={onPrev}
                  >
                    <ArrowBackIcon /> Previous
                  </Button>
                </Tooltip>
              )}

              {step === 0 && (
                <>
                  <div>
                    <Button
                      type='button'
                      onClick={() => setAllowedToDraw((bool) => !bool)}
                      style={{
                        borderBottom: `10px solid ${
                          allowedToDraw ? "yellow" : "transparent"
                        }`,
                      }}
                    >
                      <DriveFileRenameOutlineIcon fontSize='large' />
                    </Button>
                    <Button onClick={undoLastChange}>
                      <UndoIcon fontSize='large' />
                    </Button>
                  </div>
                </>
              )}

              {step < 2 && (
                <Tooltip title='Go to the Next Step' arrow>
                  <Button
                    variant='outlined'
                    type='button'
                    onClick={() => {
                      if (step === 0) takeScreenshot();
                      setStep((step) => step + 1);
                    }}
                    className={styles.nextBtn}
                  >
                    Next
                    <ArrowForwardIcon />
                  </Button>
                </Tooltip>
              )}
              {step === 2 && (
                <Tooltip title='Submit Bug Report' arrow>
                  <Button
                    className={styles.nextBtn}
                    variant='outlined'
                    type='submit'
                    onClick={handleSubmit(onSubmit)}
                  >
                    Submit <CheckIcon />
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default MultistepForm;
