import { InflateToken } from './inflate/inflate';
import { colorTurbo } from './colorTurbo';
import styled from 'styled-components';
import { colorToHex } from '@0b5vr/experimental';
import { useFloating } from '@floating-ui/react-dom';
import { useCallback, useMemo, useState } from 'react';

interface Props {
  token: InflateToken;
}

export const Token: React.FC<Props> = ( { token } ) => {
  const color = useMemo( () => {
    const rgb = colorTurbo( ( token.bits / 10.0 ) / token.content.length );
    return colorToHex( rgb );
  }, [ token ] );

  const { x, y, reference, floating, strategy } = useFloating();

  const [ showTooltip, setShowTooltip ] = useState( false );

  const handleEnter = useCallback( () => {
    setShowTooltip( true );
  }, [] );

  const handleLeave = useCallback( () => {
    setShowTooltip( false );
  }, [] );

  const tooltipContent = useMemo( () => <>
    <div>bits: { token.bits.toFixed( 2 ) }</div>
    { Object.entries( token.details ).map( ( [ key, value ] ) => (
      <div key={ key }>
        { key }: { value }
      </div>
    ) ) }
  </>, [ token ] );

  return <>
    <Root
      ref={ reference }
      onMouseEnter={ handleEnter }
      onMouseLeave={ handleLeave }
      style={{
        backgroundColor: color,
      }}
    >
      { token.content }
    </Root>
    {
      showTooltip && (
        <Tooltip
          ref={ floating }
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
        >
          { tooltipContent }
        </Tooltip>
      )
    }
  </>
};

const Root = styled.div`
  padding: 1px;
  color: #ffffff;
  text-shadow:
    -1px -1px 0 rgba(0, 0, 0, 0.5),
    -1px 1px 0 rgba(0, 0, 0, 0.5),
    1px -1px 0 rgba(0, 0, 0, 0.5),
    1px 1px 0 rgba(0, 0, 0, 0.5);
  font-family: "Consolas", monospace;
  font-size: 14px;
`;

const Tooltip = styled.div`
  background: #123;
  color: #fff;
  padding: 4px;
  border-radius: 4px;
`;
