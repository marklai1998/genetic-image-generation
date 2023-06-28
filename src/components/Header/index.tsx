import React from 'react'
import logo from '../../assets/logo.svg'
import ghLogo from '../../assets/github-logo.svg'
import styled from '@emotion/styled'

export const Header = () => (
  <Wrapper>
    <Logo src={logo} alt='logo' />
    <Title>Genetic Image Generation</Title>
    <a href='https://github.com/marklai1998/genetic-image-generation'>
      <GHLogo src={ghLogo} alt='git-hub-logo' />
    </a>
  </Wrapper>
)

const Wrapper = styled.header`
  background-color: #242424;
  height: 50px;
  flex-shrink: 0;
  display: flex;
`

const Logo = styled.img`
  height: 30px;
  padding: 10px;
  background-color: #2d3034;
  color: #e6e6e6;
`

const Title = styled.div`
  line-height: 50px;
  color: #e6e6e6;
  font-size: 20px;
  padding-left: 15px;
  font-weight: bold;
  width: 100%;
  overflow: hidden;
`

const GHLogo = styled.img`
  height: 30px;
  padding: 10px;
  background-color: #2d3034;
  color: #e6e6e6;
  transition: 0.5s;

  &:hover {
    background-color: rgb(53, 53, 53);
  }
`
