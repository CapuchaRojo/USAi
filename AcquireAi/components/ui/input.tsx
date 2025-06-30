import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface InputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  style?: any;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  className?: string;
  onKeyPress?: (e: any) => void;
  onSubmitEditing?: () => void;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
}

export const Input: React.FC<InputProps> = ({ 
  value,
  onChangeText,
  placeholder,
  style,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  className = "",
  onKeyPress,
  onSubmitEditing,
  returnKeyType = 'done',
  ...props 
}) => {
  return (
    <TextInput
      style={[styles.input, style]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors.textMuted}
      multiline={multiline}
      numberOfLines={numberOfLines}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      onKeyPress={onKeyPress}
      onSubmitEditing={onSubmitEditing}
      returnKeyType={returnKeyType}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.darkGray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    fontFamily: 'monospace',
  },
});