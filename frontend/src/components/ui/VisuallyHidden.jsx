/**
 * VisuallyHidden
 * Renders content that is visually hidden but accessible to screen readers.
 * Use for icon-only buttons, decorative elements with meaning, etc.
 */
const VisuallyHidden = ({ children, as: Tag = 'span' }) => (
  <Tag
    style={{
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      borderWidth: '0',
    }}
  >
    {children}
  </Tag>
)

export default VisuallyHidden
