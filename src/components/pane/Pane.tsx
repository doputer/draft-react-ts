import { Props } from './interface';

export const Pane = ({ children }: Props): JSX.Element => {
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      {children}
    </div>
  );
};
