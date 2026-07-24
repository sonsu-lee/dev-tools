'use client';

import { create, props } from '@stylexjs/stylex';
import { useRef, useState } from 'react';

const styles = create({
  root: {
    display: 'grid',
    gap: {
      default: 40,
      '@media (max-width: 520px)': 30,
    },
    width: '100%',
  },
  topbar: {
    alignItems: 'center',
    borderBottomColor: '#292B2F',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  brand: {
    color: '#F7F8F8',
    fontFamily: 'var(--font-geist-mono)',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '-0.02em',
  },
  brandSeparator: {
    color: '#666970',
    marginInline: 3,
  },
  glassSurface: {
    backdropFilter: {
      default: 'blur(16px) saturate(115%)',
      '@media (prefers-reduced-transparency: reduce)': 'none',
      '@media (prefers-contrast: more)': 'none',
    },
    backgroundColor: {
      default: 'rgba(23, 24, 27, 0.72)',
      '@media (prefers-reduced-transparency: reduce)': '#17181B',
      '@media (prefers-contrast: more)': '#17181B',
    },
  },
  localBadge: {
    alignItems: 'center',
    borderColor: '#3A3C42',
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: 1,
    color: '#C8CBCF',
    display: 'flex',
    fontFamily: 'var(--font-geist-mono)',
    fontSize: 11,
    fontWeight: 500,
    gap: 8,
    letterSpacing: '0.02em',
    minHeight: 32,
    paddingInline: 11,
  },
  localDot: {
    backgroundColor: '#C9F05A',
    borderRadius: 999,
    boxShadow: '0 0 0 3px rgba(201, 240, 90, 0.1)',
    height: 6,
    width: 6,
  },
  intro: {
    display: 'grid',
    gap: 13,
    maxWidth: 650,
  },
  title: {
    color: '#F7F8F8',
    fontSize: {
      default: 40,
      '@media (max-width: 520px)': 32,
    },
    fontWeight: 560,
    letterSpacing: '-0.045em',
    lineHeight: 1.05,
  },
  lead: {
    color: '#A9ADB4',
    fontSize: 16,
    lineHeight: 1.65,
    maxWidth: 580,
  },
  panel: {
    backgroundColor: '#101113',
    borderColor: '#292B2F',
    borderRadius: 14,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.28), 0 1px 0 rgba(255, 255, 255, 0.03) inset',
    overflow: 'hidden',
  },
  operatorRail: {
    alignItems: {
      default: 'center',
      '@media (max-width: 520px)': 'flex-start',
    },
    backgroundColor: '#0D0E10',
    borderBottomColor: '#292B2F',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: {
      default: 'row',
      '@media (max-width: 520px)': 'column',
    },
    gap: 8,
    justifyContent: 'space-between',
    paddingBlock: 13,
    paddingInline: {
      default: 22,
      '@media (max-width: 520px)': 18,
    },
  },
  operator: {
    color: '#DDE1E5',
    fontFamily: 'var(--font-geist-mono)',
    fontSize: 13,
    fontWeight: 520,
  },
  operatorMeta: {
    color: '#858A92',
    fontFamily: 'var(--font-geist-mono)',
    fontSize: 10,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  form: {
    display: 'grid',
    gap: 22,
    padding: {
      default: 24,
      '@media (max-width: 520px)': 18,
    },
  },
  field: {
    display: 'grid',
    gap: 9,
  },
  fieldHeading: {
    alignItems: 'baseline',
    display: 'flex',
    gap: 12,
    justifyContent: 'space-between',
  },
  label: {
    color: '#E9EBED',
    fontSize: 13,
    fontWeight: 560,
  },
  fieldHint: {
    color: '#858A92',
    fontFamily: 'var(--font-geist-mono)',
    fontSize: 10,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#17181B',
    borderColor: {
      default: '#666970',
      ':hover': '#7D8189',
      ':focus-visible': '#C9F05A',
    },
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    color: '#F7F8F8',
    fontFamily: 'var(--font-geist-mono)',
    fontSize: 16,
    minHeight: 50,
    outline: {
      default: 'none',
      ':focus-visible': '2px solid #C9F05A',
    },
    outlineOffset: {
      default: 0,
      ':focus-visible': 2,
    },
    paddingInline: 14,
    transitionDuration: {
      default: '140ms',
      '@media (prefers-reduced-motion: reduce)': '0ms',
    },
    transitionProperty: 'border-color, outline-color',
    width: '100%',
  },
  output: {
    backgroundColor: '#141517',
    color: '#D9DCDF',
  },
  controls: {
    alignItems: {
      default: 'center',
      '@media (max-width: 520px)': 'stretch',
    },
    display: 'flex',
    flexDirection: {
      default: 'row',
      '@media (max-width: 520px)': 'column',
    },
    gap: 14,
    justifyContent: 'space-between',
  },
  checkboxLabel: {
    alignItems: 'center',
    borderColor: '#3A3C42',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    color: '#D1D4D8',
    cursor: 'pointer',
    display: 'flex',
    fontSize: 13,
    gap: 9,
    minHeight: 44,
    paddingInline: 13,
    width: 'fit-content',
  },
  checkbox: {
    accentColor: '#C9F05A',
    height: 17,
    width: 17,
  },
  actions: {
    display: 'flex',
    gap: 9,
  },
  button: {
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    cursor: {
      default: 'pointer',
      ':disabled': 'not-allowed',
    },
    fontFamily: 'var(--font-geist-sans)',
    fontSize: 13,
    fontWeight: 620,
    minHeight: 44,
    opacity: {
      default: 1,
      ':disabled': 0.42,
    },
    outline: {
      default: 'none',
      ':focus-visible': '2px solid #C9F05A',
    },
    outlineOffset: {
      default: 0,
      ':focus-visible': 2,
    },
    paddingInline: 16,
    transitionDuration: {
      default: '140ms',
      '@media (prefers-reduced-motion: reduce)': '0ms',
    },
    transitionProperty: 'background-color, border-color, color, opacity',
  },
  clearButton: {
    backgroundColor: {
      default: 'rgba(23, 24, 27, 0.72)',
      ':hover': '#222429',
    },
    borderColor: {
      default: '#3A3C42',
      ':hover': '#5A5E66',
    },
    color: '#D1D4D8',
  },
  copyButton: {
    backgroundColor: {
      default: '#C9F05A',
      ':hover': '#D4F477',
      ':disabled': '#626C49',
    },
    borderColor: {
      default: '#C9F05A',
      ':hover': '#D4F477',
      ':disabled': '#626C49',
    },
    color: {
      default: '#101208',
      ':disabled': '#1D2115',
    },
    flexGrow: {
      default: 0,
      '@media (max-width: 520px)': 1,
    },
  },
  messageSlot: {
    minHeight: 21,
  },
  message: {
    color: '#C9F05A',
    fontFamily: 'var(--font-geist-mono)',
    fontSize: 12,
    lineHeight: 1.7,
  },
  error: {
    color: '#F97066',
    fontFamily: 'var(--font-geist-mono)',
    fontSize: 12,
    lineHeight: 1.7,
  },
  privacy: {
    borderLeftColor: '#3A3C42',
    borderLeftStyle: 'solid',
    borderLeftWidth: 1,
    display: 'grid',
    gap: 7,
    paddingLeft: 18,
  },
  privacyTitle: {
    color: '#D6D9DC',
    fontFamily: 'var(--font-geist-mono)',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  privacyText: {
    color: '#8A8F98',
    fontSize: 13,
    lineHeight: 1.65,
    maxWidth: 650,
  },
  warning: {
    color: '#A9ADB4',
    fontSize: 12,
    lineHeight: 1.6,
    marginTop: 2,
  },
});

export default function UrlEncoder() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [showValues, setShowValues] = useState(false);
  const [value, setValue] = useState('');

  let encodedValue = '';
  let encodingFailed = false;

  try {
    encodedValue = encodeURIComponent(value);
  } catch {
    encodingFailed = true;
  }

  const clearValues = () => {
    setValue('');
    setShowValues(false);
    setMessage('');
    inputRef.current?.focus();
  };

  const copyEncodedValue = async () => {
    try {
      await navigator.clipboard.writeText(encodedValue);
      setValue('');
      setShowValues(false);
      setMessage('Copied and cleared.');
      inputRef.current?.focus();
    } catch {
      setShowValues(true);
      setMessage('Copy failed. Your values were kept.');
    }
  };

  return (
    <div {...props(styles.root)}>
      <header {...props(styles.topbar)}>
        <div {...props(styles.brand)}>
          dev<span {...props(styles.brandSeparator)}>/</span>tools
        </div>
        <div {...props(styles.glassSurface, styles.localBadge)}>
          <span aria-hidden="true" {...props(styles.localDot)} />
          <span>Local only</span>
        </div>
      </header>

      <section aria-labelledby="encoder-title" {...props(styles.intro)}>
        <h1 id="encoder-title" {...props(styles.title)}>
          URL component encoder
        </h1>
        <p {...props(styles.lead)}>
          Encode a string with JavaScript&apos;s <code>encodeURIComponent()</code>.
        </p>
      </section>

      <section aria-label="URL component encoder workspace" {...props(styles.panel)}>
        <div {...props(styles.operatorRail)}>
          <code {...props(styles.operator)}>encodeURIComponent()</code>
          <span {...props(styles.operatorMeta)}>browser · synchronous</span>
        </div>

        <div {...props(styles.form)}>
          <label {...props(styles.field)}>
            <span {...props(styles.fieldHeading)}>
              <span {...props(styles.label)}>Original value</span>
              <span {...props(styles.fieldHint)}>plain string</span>
            </span>
            <input
              {...props(styles.input)}
              aria-describedby={encodingFailed ? 'encoding-error' : undefined}
              autoComplete="off"
              onChange={(event) => {
                setValue(event.currentTarget.value);
                setMessage('');
              }}
              ref={inputRef}
              spellCheck={false}
              type={showValues ? 'text' : 'password'}
              value={value}
            />
          </label>

          <label {...props(styles.field)}>
            <span {...props(styles.fieldHeading)}>
              <span {...props(styles.label)}>Encoded value</span>
              <span {...props(styles.fieldHint)}>URL component</span>
            </span>
            <input
              {...props(styles.input, styles.output)}
              readOnly
              spellCheck={false}
              type={showValues ? 'text' : 'password'}
              value={encodedValue}
            />
          </label>

          <div {...props(styles.controls)}>
            <label {...props(styles.glassSurface, styles.checkboxLabel)}>
              <input
                {...props(styles.checkbox)}
                checked={showValues}
                onChange={(event) => {
                  setShowValues(event.currentTarget.checked);
                }}
                type="checkbox"
              />
              <span>Show values</span>
            </label>

            <div {...props(styles.actions)}>
              <button
                {...props(styles.glassSurface, styles.button, styles.clearButton)}
                disabled={value.length === 0}
                onClick={clearValues}
                type="button"
              >
                Clear
              </button>
              <button
                {...props(styles.button, styles.copyButton)}
                disabled={encodedValue.length === 0 || encodingFailed}
                onClick={() => {
                  void copyEncodedValue();
                }}
                type="button"
              >
                Copy encoded value
              </button>
            </div>
          </div>

          <div {...props(styles.messageSlot)}>
            {encodingFailed ? (
              <p id="encoding-error" role="alert" {...props(styles.error)}>
                This value contains an invalid Unicode sequence.
              </p>
            ) : (
              <output aria-live="polite" {...props(styles.message)}>
                {message}
              </output>
            )}
          </div>
        </div>
      </section>

      <aside aria-label="Privacy note" {...props(styles.privacy)}>
        <p {...props(styles.privacyTitle)}>Local processing</p>
        <p {...props(styles.privacyText)}>
          Your input is processed in this tab and is not sent to our server or browser storage.
          Copying places the encoded value on your system clipboard.
        </p>
        <p {...props(styles.warning)}>URL encoding is reversible. It is not encryption.</p>
      </aside>
    </div>
  );
}
