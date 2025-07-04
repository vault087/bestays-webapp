/**
 * @fileoverview Canvas Module - Property editing workspace components
 *
 * 🎯 PURPOSE: Main property editing canvas components
 *
 * This module contains the tightly-coupled canvas components that form
 * the main property editing interface:
 * - PropertyCanvas: Main workspace component
 * - PropertyEditorList: Scrollable list of properties  
 * - PropertyEditorRow: Individual property editing row
 *
 * 🏗️ ARCHITECTURE: These components are co-located because they form
 * a tight composition hierarchy and share canvas-specific concerns.
 */

export { default as PropertyCanvas } from "./property-canvas";
export { PropertyEditorList } from "./property-editor-list";
export { PropertyEditorRow } from "./property-editor-row";
