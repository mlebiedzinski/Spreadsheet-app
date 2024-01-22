import { Cell } from "../components/Cells/cell";

export interface ISpreadsheet {
    getGrid(): Cell[][];
  }
  