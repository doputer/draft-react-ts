import { DraftEditor } from './components/draft/DraftEditor';
import { Pane } from './components/pane/Pane';
import { View } from './components/view/View';

function App() {
  return (
    <>
      <Pane>
        <DraftEditor />
        <View />
      </Pane>
    </>
  );
}

export default App;
