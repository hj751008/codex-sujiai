import { PropsWithChildren } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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

export function Caption({ children }: PropsWithChildren) {
  return <Text style={styles.caption}>{children}</Text>;
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

export function ActionButton({
  label,
  onPress,
  variant = "primary",
  disabled,
}: {
  label: string;
  onPress: () => void | Promise<void>;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        variant === "secondary" ? styles.buttonSecondary : null,
        disabled ? styles.buttonDisabled : null,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "secondary" ? styles.buttonSecondaryText : null,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function FieldLabel({ children }: PropsWithChildren) {
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

export function InputField(
  props: React.ComponentProps<typeof TextInput> & { secure?: boolean },
) {
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      secureTextEntry={props.secure}
      {...props}
      style={[styles.input, props.style]}
    />
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected ? styles.chipSelected : null]}
    >
      <Text style={[styles.chipText, selected ? styles.chipTextSelected : null]}>
        {label}
      </Text>
    </Pressable>
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
  caption: {
    fontSize: 13,
    lineHeight: 20,
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
  buttonSecondary: {
    backgroundColor: colors.sky,
  },
  buttonSecondaryText: {
    color: colors.ink,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.ink,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e6dfd2",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: "#fffdf9",
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.sky,
  },
  chipSelected: {
    backgroundColor: colors.accent,
  },
  chipText: {
    color: colors.ink,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: "white",
  },
});
