import React from 'react'
import { render } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { BackButton } from '../../src/components/BackButton'

describe('<BackButton />', () => {
  test('renders correctly', () => {
    const { container } = render(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>,
    )

    expect(container).toMatchSnapshot()
  })
})
