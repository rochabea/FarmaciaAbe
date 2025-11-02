import { Stack } from "expo-router";
import React from "react";

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ presentation: "modal", headerShown: false }} />
  );
}
