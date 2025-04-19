// DynamicListSlot.types.ts
import React from "react";

// Tipos base reutilizables
export type ActionSlotVariant = "button" | "icon";
export type ActionMode = "local" | "remote";
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
export type ActionType =
  | "download"
  | "edit"
  | "delete"
  | "view"
  | "create"
  | "enable"
  | "disable"
  | "export"
  | "custom";

export interface ExportConfig {
  exportFileName?: string;
  exportFormat?: "json" | "csv" | "pdf";
  exportPath?: string;
}

export interface ClickableActionConfig {
  name:
    | "openMultiSelectModal"
    | "openRelatedRecordsModal"
    | "edit"
    | "export"
    | "delete"
    | "custom";
  config?: Record<string, any> & ExportConfig;
}

// Slots pasivos
export interface TextSlot {
  type: "text";
  name: string;
  label?: string;
  config?: {
    style?: React.CSSProperties;
    color?: string;
  };
}

export interface TemplateSlot {
  type: "template";
  name: string;
  label?: string;
  config: {
    template: string;
    containerStyle?: React.CSSProperties;
  };
}

export interface IconSlot {
  type: "icon";
  name: string;
  label?: string;
  config?: {
    size?: number;
    color?: string;
    defaultIcon?: string;
  };
}

export interface ThumbnailSlot {
  type: "thumbnail";
  name: string;
  label?: string;
  config?: {
    size?: number;
    defaultImage?: string;
    style?: React.CSSProperties;
  };
}

export interface StackedThumbnailsSlot {
  type: "stackedThumbnails";
  name: string;
  label?: string;
  config?: {
    maxDisplayed?: number;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    spacing?: number;
    borderColor?: string;
    overflowStyle?: React.CSSProperties;
    overflowTextStyle?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    clickableAction?: ClickableActionConfig;
    onClick?: (slot: Slot, item: any) => void;
  };
}

export interface MoneySlot {
  type: "money";
  name: string;
  label?: string;
  config?: {
    currencySymbol?: string;
    symbolPosition?: "start" | "end";
    decimalSeparator?: "." | "," | undefined;
    thousandsSeparator?: "." | "," | undefined;
    decimalPlaces?: number;
    containerStyle?: React.CSSProperties;
    symbolStyle?: React.CSSProperties;
    amountStyle?: React.CSSProperties;
  };
}

// Slots de acción
export interface ActionSlot {
  type: "action";
  name: string;
  label?: string;
  config: {
    variant: ActionSlotVariant;
    mode: ActionMode;
    actionType?: ActionType;
    buttonType?: "clear" | "outline" | "solid";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    icon?: string;
    title?: string;
    apiBaseUrl?: string;
    path?: string;
    method?: HttpMethod;
    useAuthToken?: boolean;
    spinnerColor?: string;
    color?: string;
    borderRadius?: number;
    clickableAction?: ClickableActionConfig;
    exportFileName?: string;
    exportFormat?: string;
    onClick?: (slot: Slot, itemData: any, itemIndex: number) => void;
    onSuccess?: (slot: Slot, item: any, itemIndex: number, res: any) => void;
  };
}

export interface ActionsGroupSlot {
  type: "actionsGroup";
  name: string;
  label?: string;
  config: {
    items: Array<{
      name: string;
      variant: ActionSlotVariant;
      mode: ActionMode;
      icon?: string;
      title?: string;
      actionType?: ActionType;
      apiBaseUrl?: string;
      path?: string;
      method?: HttpMethod;
      useAuthToken?: boolean;
      exportFileName?: string;
      exportFormat?: string;
      onClick?: (type: string, name: string) => void;
    }>;
    containerStyle?: React.CSSProperties;
    onItemSelect?: (actionName: string) => void;
  };
}

export interface ActionsMenuSlot {
  type: "actionsMenu";
  name: string;
  label?: string;
  config: {
    menuItems: Array<{
      name: string;
      label: string;
      icon?: string;
      actionType?: ActionType;
      apiBaseUrl?: string;
      path?: string;
      method?: HttpMethod;
      useAuthToken?: boolean;
      color?: string;
      exportFileName?: string;
      exportFormat?: string;
    }>;
    onItemSelect?: (actionName: string) => void;
  };
}

// Unión de todos los tipos de Slot
export type Slot =
  | ActionSlot
  | ActionsGroupSlot
  | ActionsMenuSlot
  | TextSlot
  | TemplateSlot
  | IconSlot
  | ThumbnailSlot
  | StackedThumbnailsSlot
  | MoneySlot;
