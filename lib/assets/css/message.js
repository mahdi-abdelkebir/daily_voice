
import { StyleSheet } from 'react-native';
export const bubbleStyles = StyleSheet.create({
  //ChatView
  messageBubble: {
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
    marginLeft: 5,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: 'row',

    flexShrink: 1

  },

  messageBubbleText: {
    paddingHorizontal: 5,

    color: 'black'
  },

  messageBubbleLeft: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: '#EFEFEF'
  },

  messageBubbleRight: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#F6D7FF'
  }
});