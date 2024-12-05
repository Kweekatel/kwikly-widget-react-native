# kwikly-widget-react-native

React native wrapper for live chat widget for Kwikly by Kweekatel

## Installation

To install the package, run the following command:

```sh
npm i @kweekatel/kwikly-widget-react-native
```

## Usage

Here's an example of how to integrate the Kwikly Live Chat Widget into your React Native app:

```js
import { StyleSheet, View, Text, Button } from 'react-native';
import {
  KwiklyChatProvider,
  KwiklyWidgetButton,
  KwiklyLiveChatWidget,
} from '@kweekatel/kwikly-widget-react-native';

export default function App() {
  return (
    <KwiklyChatProvider widgetId="1744912446839527000640482">
      <View style={{ flex: 1, position: 'relative' }}>
        <View
          style={{
            position: 'absolute',
            bottom: 50,
            zIndex: 1000,
            elevation: 1000,
          }}
        >
          <KwiklyWidgetButton />
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
          <Button title="Go to Page 2" />
        </View>
      </View>
    </KwiklyChatProvider>
  );
}

const styles = StyleSheet.create({
  //
});
```

## Available Components

- `KwiklyChatProvider`

  The `KwiklyChatProvider` component is used to wrap your app and manage the live chat state. It provides several context values to control the behavior of the chat widget, such as whether the chat is open or closed, unread messages, the current page, and user information.

  #### Props:

  `widgetId` (string, required): The ID of your Kwikly widget. You can find this in your Kwikly admin panel.

  Example:

  ```js
  import { KwiklyChatProvider } from 'kwikly-widget-react-native';

  <KwiklyChatProvider widgetId="your-widget-id">
    {/* Your app content */}
  </KwiklyChatProvider>;
  ```

- `KwiklyWidgetButton`
  This is the button that will be shown on the screen to trigger the live chat widget. It automatically displays the number of unread messages in a badge if any messages are unread.

  #### Props:

  `triggerElement` (optional): A custom element to use as the trigger. If not provided, a default button will be shown.

  Example:

  ```js
  import { KwiklyWidgetButton } from 'kwikly-widget-react-native';

  <KwiklyWidgetButton />;
  ```

- `KwiklyLiveChatWidget`
  This component displays the live chat widget. It listens for messages from the widget and manages the chat interface, such as loading state and user interactions.

  Example:

  ```js
  import { KwiklyLiveChatWidget } from 'kwikly-widget-react-native';

  <KwiklyLiveChatWidget />;
  ```

## Custom Hooks

`useKwiklyChat`
This custom hook allows you to access the current chat state, including information such as whether the chat is open, the current page, the user details, unread messages, and more.

Example:

```js
import { useKwiklyChat } from 'kwikly-widget-react-native';

const { isChatOpen, currentPage, unreadMessages, setUser } = useKwiklyChat();
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
