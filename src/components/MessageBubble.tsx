
import React from 'react';
import { Text, View } from 'react-native';
import { bubbleStyles } from '../Assets/css/message';

const MessageBubble = ({ who, message }) => {
    var leftSpacer = who === 'bot' ? null : <View style={{width: 70}}/>;
    var rightSpacer = who === 'bot' ? <View style={{width: 70}}/> : null;
    var viewStyle = who === 'bot' ? [bubbleStyles.messageBubble, bubbleStyles.messageBubbleLeft] : [bubbleStyles.messageBubble, bubbleStyles.messageBubbleRight];

    return (
      <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
        {leftSpacer}
        <View style={viewStyle}>
          <Text style={bubbleStyles.messageBubbleText}>
            {message}
          </Text>
        </View>
        {rightSpacer}
      </View>
    )
}

export default MessageBubble;