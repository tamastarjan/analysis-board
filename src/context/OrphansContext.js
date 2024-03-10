import { createContext } from "react";
import { uid } from "./uid";

export class OrphanNode {
  constructor(name) {
    this.id = uid();
    this.name = name;
    this.type = "OrphanNode";
    this.children = [];
  }
}

export const getOrphans = () => {
  const orphansJson = localStorage.getItem("orphans");
  if (!orphansJson) {
    return [];
  }

  return JSON.parse(orphansJson) || [];
};

export const updateOrphans = (orphans) => {
  localStorage.setItem("orphans", JSON.stringify(orphans));
  return getOrphans();
};

export const OrphansContext = createContext([]);
