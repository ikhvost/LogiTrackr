import React from 'react'
import { diffJson, Change } from 'diff'

interface Props {
  oldData: unknown
  currentData: unknown
}

enum DiffType {
  Added = 'added',
  Removed = 'removed',
  Unchanged = 'unchanged',
}

export const Diff = ({ oldData, currentData }: Props) => {
  const differences = diffJson(oldData, currentData)

  const renderLine = (line: string, type: DiffType) => {
    const added = 'bg-green-100 text-green-800'
    const removed = 'bg-red-100 text-red-800'
    const unchanged = ''

    return (
      <div className={type === DiffType.Added ? added : type === DiffType.Removed ? removed : unchanged}>{line}</div>
    )
  }

  const renderPart = (part: Change) => {
    return part.value
      .split('\n')
      .map((line, index) => (
        <React.Fragment key={index}>
          {renderLine(line, part.added ? DiffType.Added : part.removed ? DiffType.Removed : DiffType.Unchanged)}
        </React.Fragment>
      ))
  }

  return (
    <div className="flex">
      <div className="w-1/2 pr-2">
        <h4 className="text-md font-semibold mb-1">Previous Version</h4>
        <pre className="whitespace-pre-wrap bg-white p-2 rounded text-sm">
          {differences.map((part, index) => (
            <React.Fragment key={index}>{!part.added && renderPart(part)}</React.Fragment>
          ))}
        </pre>
      </div>
      <div className="w-1/2 pl-2">
        <h4 className="text-md font-semibold mb-1">Current Version</h4>
        <pre className="whitespace-pre-wrap bg-white p-2 rounded text-sm">
          {differences.map((part, index) => (
            <React.Fragment key={index}>{!part.removed && renderPart(part)}</React.Fragment>
          ))}
        </pre>
      </div>
    </div>
  )
}
