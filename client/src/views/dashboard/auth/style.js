import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* Dim the background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure it's above all other content */
`;

export default Overlay; 