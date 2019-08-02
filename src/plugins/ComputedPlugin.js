import React from 'react';

/**
 * A plugin for a variable
 */
function ComputedPlugin(opts) {
  const name = 'computed';
  const options = opts;

  const tags = [
    {
      html: 'computed',
      slate: 'computed',
      md: 'computed'
    }
  ];

  /**
   * Augment the base schema with the variable type
   * @param {*} schema
   */
  const augmentSchema = ((schema) => {
    const additions = {
      inlines: {
        variable: {
          nodes: [{
            match: { object: 'text' }
          }]
        },
      },
    };

    const newSchema = JSON.parse(JSON.stringify(schema));
    newSchema.inlines = { ...newSchema.inlines, ...additions.inlines };
    newSchema.document.nodes[0].match.push({ type: tags[0].slate });
    newSchema.blocks.paragraph.nodes[0].match.push({ type: tags[0].slate });
    return newSchema;
  });

  /**
   * Render a Slate inline.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */
  function renderInline(props, editor, next) {
    const { attributes, children, node } = props;

    switch (node.type) {
      case 'computed': {
        // @ts-ignore
        return <span {...attributes} className='computed'>
            {children}
          </span>;
      }

      default: {
        return next();
      }
    }
  }

  /**
     * @param {ToMarkdown} parent
     * @param {Node} value
     */
  function toMarkdown(parent, value) {
    let textValue = '';

    if (value.nodes.size > 0 && value.nodes.get(0).text) {
      textValue = value.nodes.get(0).text;
    }

    if (opts && opts.rawValue) {
      return `{{${textValue}}}`;
    }

    const attributes = value.data.get('attributes');
    let result = `<computed value="${encodeURI(textValue)}"`;

    result += '/>';
    return result;
  }

  /**
 * Handles data from markdown.
 */
  function fromMarkdown(stack, event, tag, node) {
    const parent = stack.peek();

    // variables can only occur inside paragraphs
    if (!parent.type || parent.type !== 'paragraph') {
      const para = {
        object: 'block',
        type: 'paragraph',
        data: {},
        nodes: [],
      };
      stack.push(para);
    }

    const inline = {
      object: 'inline',
      type: 'computed',
      data: Object.assign(tag),
      nodes: [{
        object: 'text',
        text: `${decodeURI(tag.attributes.value)}`,
      }]
    };

    stack.append(inline);

    if (!parent.type || parent.type !== 'paragraph') {
      stack.pop();
    }

    return true;
  }

  /**
 * Handles data from the HTML format.
 */
  function fromHTML(editor, el, next) {
    return {
      object: 'block',
      type: 'computed',
      data: {},
      nodes: next(el.childNodes),
    };
  }

  return {
    name,
    tags,
    augmentSchema,
    renderInline,
    toMarkdown,
    fromMarkdown,
    fromHTML,
  };
}

export default ComputedPlugin;
