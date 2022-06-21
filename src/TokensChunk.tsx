import { useMemo, useRef } from 'react';
import { useIntersection } from 'react-use';
import styled from 'styled-components';
import { InflateToken } from './inflate/inflate';
import { Token } from './Token';

interface Props {
  tokens: InflateToken[];
}

export const TokensChunk: React.FC<Props> = ( { tokens } ) => {
  const isectRef = useRef<HTMLDivElement>( null );
  const isect = useIntersection( isectRef, {
    root: null,
  } );
  const isIsect = isect?.isIntersecting;

  const tokenElements = useMemo( () => (
    tokens.map( ( token, i ) => (
      <Token key={ i } token={ token } />
    ) )
  ), [ tokens ] );

  return (
    <>
      <Root
        ref={ isectRef }
      >
        { isIsect && tokenElements }
      </Root>
    </>
  );
};

const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(64, max-content);
  width: ${ 64 * 12 }px;
  height: ${ 4 * 20 }px;
`;
