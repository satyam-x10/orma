import React from "react";
import { ImageProcessorProps } from "../../types";

const NudityFlaggedContext = React.createContext<ImageProcessorProps| undefined>(undefined);

export default NudityFlaggedContext;