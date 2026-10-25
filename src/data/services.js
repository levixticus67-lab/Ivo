import { Building2, HardHat, Layers, Ruler, Wrench } from "lucide-react";

export const services = [
  { id: "commercial", imageKey: "commercial", icon: Building2, title: "Commercial construction", intro: "Build and fit-out delivery for commercial spaces.", details: ["Scope and feasibility coordination", "Construction planning and contractor coordination", "Progress, quality, and handover checks"] },
  { id: "design", imageKey: "design", icon: Ruler, title: "Structural & architectural design", intro: "Design services that connect intent with buildable decisions.", details: ["Brief development and concept coordination", "Structural design coordination", "Technical documentation and design reviews"] },
  { id: "infrastructure", imageKey: "infrastructure", icon: Layers, title: "Civil engineering & infrastructure", intro: "Civil works planned around the needs of the site and the wider project.", details: ["Site and infrastructure planning", "Civil design coordination", "Construction-stage technical support"] },
  { id: "renovation", imageKey: "renovation", icon: Wrench, title: "High-end renovations", intro: "Careful upgrades for spaces that need a new standard of function or finish.", details: ["Existing-condition review", "Interior scope and finish coordination", "Phased delivery planning"] },
  { id: "management", imageKey: "management", icon: HardHat, title: "Project management", intro: "Practical oversight across scope, programme, communication, and delivery.", details: ["Project setup and milestone planning", "Risk and decision tracking", "Progress reporting and close-out coordination"] },
];
