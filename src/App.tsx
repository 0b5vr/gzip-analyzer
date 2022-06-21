import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { inflate, InflateToken } from './inflate/inflate';
import { Token } from './Token';
import { TokensChunk } from './TokensChunk';

export const App: React.FC = () => {
  const [ tokens, setTokens ] = useState<InflateToken[] | undefined>();

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    async ( event ) => {
      const file = event.currentTarget.files?.[ 0 ];

      if ( file != null ) {
        const buffer = await file.arrayBuffer();
        const array = new Uint8Array( buffer, 2 );

        const result = inflate( array );

        setTokens( result );
      }
    },
    [],
  );

  const tokenChunks = useMemo( () => {
    if ( tokens == null ) { return []; }

    const chunkLength = 64 * 4;
    const nChunk = tokens.length / chunkLength;

    const chunks: InflateToken[][] = [];
    for ( let i = 0; i < nChunk; i ++ ) {
      const start = i * chunkLength;
      chunks.push( tokens.slice( start, start + chunkLength ) );
    }

    return chunks;
  }, [ tokens ] );

  return (
    <>
      <input type="file" onChange={ handleFileChange } />
      <TokensContainer>
        { tokenChunks.map( ( chunk, i ) => (
          <TokensChunk key={ i } tokens={ chunk } />
        ) ) }
      </TokensContainer>
    </>
  );
};

const TokensContainer = styled.div`
`;
