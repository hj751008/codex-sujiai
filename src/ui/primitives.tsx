import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { colors } from "./theme";

export function Screen({ children }: PropsWithChildren) {
  return <View style={styles.screen}>{children}</View>;
}

export function Card({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

export function H1({ children }: PropsWithChildren) {
  return <Text style={styles.h1}>{children}</Text>;
}

export function Body({ children }: PropsWithChildren) {
  return <Text style={styles.body}>{children}</Text>;
}

export function Bullet({ children }: PropsWithChildren) {
  return <Text style={styles.bullet}>• {children}</Text>;
}

export function NavButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link href={href as never} asChild>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>{label}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 18,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: colors.ink,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
  },
  bullet: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
});
