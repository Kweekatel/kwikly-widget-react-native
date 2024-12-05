import { View, Text, Button } from 'react-native';
import {
  KwiklyChatProvider,
  KwiklyWidgetButton,
  KwiklyLiveChatWidget,
} from '@kweekatel/kwikly-widget-react-native';

export default function App() {
  return (
    <KwiklyChatProvider widgetId="1744912446839527000640482">
      <View style={{ flex: 1, position: 'relative' }}>
        <View style={{ position: 'absolute', bottom: 50, zIndex: 1000 }}>
          <KwiklyWidgetButton triggerElement={null} />
        </View>
        <KwiklyLiveChatWidget />

        <View
          style={{
            flex: 1,
            position: 'relative',
            justifyContent: 'center',
            backgroundColor: 'lightblue',
            alignItems: 'center',
          }}
        >
          <Text>Welcome to Page 1</Text>
          <Button title="Go to Page 2" onPress={() => {}} />
        </View>
      </View>
    </KwiklyChatProvider>
  );
}
