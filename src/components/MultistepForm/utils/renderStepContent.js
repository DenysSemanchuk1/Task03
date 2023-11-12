import React from "react";
import InputFilesUpload from "./../../FileInput/index";
import { TextField } from "@mui/material";

const renderStepContent = (
  step,
  register,
  errors,
  screenshot,
  setIsViewerOpen
) => {
  switch (step) {
    case 0:
      return (
        <div>
          <p>
            Use your mouse to draw on the canvas that covers the whole page. You
            can mark any errors or issues that you want to report.
          </p>
        </div>
      );
    case 1:
      return (
        <div>
          <p>
            Please enter a brief description of the error or issue that you
            marked on the previous step. You can also see a screenshot of your
            drawing on the next step.
          </p>

          <div>
            <TextField
              fullWidth
              {...register("title")}
              margin='normal'
              placeholder='Title'
            />
            <TextField
              fullWidth
              {...register("description")}
              rows={6}
              multiline
              placeholder='Description'
            />
            <InputFilesUpload register={register("usefulFiles")} />

            {errors.description && (
              <span style={{ color: "red" }}>Please enter a description</span>
            )}
          </div>
        </div>
      );
    case 2:
      return (
        <>
          <img
            className='img'
            src={screenshot}
            onClick={() => setIsViewerOpen(true)}
            alt='Marked page thumbnail'
          />

          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde et,
            fugit vitae porro quia eaque cumque quae eius optio, architecto
            explicabo iusto, quas iste illo? Nisi corrupti voluptatibus esse
            error. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab
            debitis incidunt sit, ipsa perspiciatis natus molestias quo! Esse
            voluptate commodi a corporis. Rem nemo at eveniet cum rerum
            blanditiis dolorem.
          </p>
        </>
      );
    default:
      return <div>Unknown step</div>;
  }
};

export default renderStepContent;
