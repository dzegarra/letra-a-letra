import { createContext } from "react";
import { Card, CardColors } from "./types";
import { Form, GetRef } from "antd";

export const defaultColors: CardColors = ["#C0392B", "#8E44AD", "#27AE60"];

type FormInstance<T> = GetRef<typeof Form<T>>;

export const EditableContext = createContext<FormInstance<Card> | null>(null);
