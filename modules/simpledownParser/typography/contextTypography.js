var NO_WRAP_TAGS_REG = require('../consts').NO_WRAP_TAGS_REG;
var ATTRS_REG = require('../consts').ATTRS_REG;
var VERBATIM_TAGS = require('../consts').VERBATIM_TAGS;

// В отличие от остальных методов, этот работает не "точечно", а над всем текстом,
// Например "Мой `код` :)"
function replaceQuotesWithLaquo(text) {
  //console.log(1, text);
  text = text.replace( /(^|[\s><(])\"([<~0-9ёa-zа-я\-:\/])/gim, "$1«$2");


  //console.log(2, text);
  var _text = '""';

  while (text != _text) {
    _text = text;
    text = text.replace(/(«([^"]*)[>ёa-zа-я0-9\.\-:\/\?\!])\"/gim, '$1»');
    //console.log(3, text);
  }

  return text;
}

// ported from Drupal7 with fixes
function makeParagraphs(html) {
  var reg;
  html = html.replace(/\s+$/, '');

  html += "\n\n"; // just to make things a little easier, pad the end

  html = html.replace(/<br\s*\/?/gim, '<br'); // only allow simple brs
  html = html.replace(/<br>\s*?<br\/?>/gim, "\n\n");

  reg = new RegExp('<' + NO_WRAP_TAGS_REG.source + ATTRS_REG.source + '>', 'gi');

  html = html.replace(reg, function(match) {
    return "\n" + match;
  }); // \n before every <tag>

  reg = new RegExp('</' + NO_WRAP_TAGS_REG.source + '\\s*>', 'gi');

  html = html.replace(reg, function(match) {
    return match + "\n\n";
  }); // \n\n after every </tag>

  html = html.replace(/\n\n+/gim, "\n\n"); // take care of duplicates
  html = html.replace(/^\n|\n\s*\n$/g, '');

  html = '<p>' + html.replace(/\n\s*\n\n?(.)/g, "</p>\n<p>$1") + "</p>\n"; // make paragraphs, including one at the end

  html = html.replace(/<p>(<li.+?)<\/p>/gi, "$1"); // problem with nested lists

  html = html.replace(new RegExp('<p>\\s*(</?' + NO_WRAP_TAGS_REG.source + ATTRS_REG.source + '>)', 'gim'), "$1");

  // removes </p> from both </ul></p> and <ul class="..."></p>
  reg = new RegExp('(</?' + NO_WRAP_TAGS_REG.source + ATTRS_REG.source  + '>)\\s*</p>', 'gim');

  html = html.replace(reg, "$1");

  html = html.replace(/<p>\s*<\/p>\n?/g, ''); // under certain strange conditions it could create a P of entirely whitespace

  // для <table onclick='alert(1)'><tr><td>[unsafe_test]<div onclick='alert(1)'>*</div>[/unsafe_test]</td></tr></table>
  // оно генерировало ...<div>*</div><p></span> <-- лишний <p> перед </span>, убъём его
  html = html.replace(/<p>(<\/[^>]+>)/g, '$1');

  html = html.replace(/^<\/p>/, ''); // empty text leaves </p> in the beginning

// $chunk = preg_replace('!<br />(\s*@@block)!', '$1', $chunk); // remove <br /> before future blocks
  return html.replace(/\s+$/, '');
}

function contextTypography(html, options) {
  options = options || {};

  var noTypographyReg = new RegExp('<(' + VERBATIM_TAGS.join('|') + '|code|no-typography)' + ATTRS_REG.source + '>([\\s\\S]*?)</\\1>', 'gim');

  var labels = [];
  var label = ('' + Math.random()).slice(2);

  html = html.replace(noTypographyReg, function(match, tag, attrs, body) {
    // remove no-typography wrapper here
    labels.push(tag == 'no-typography' ? body : match);

    // no-typography is a block tag!
    return (tag == 'code') ? ('<span>' + label + '</span>') : ('<div>' + label + '</div>');
  });

  html = replaceQuotesWithLaquo(html);

  if (!options.noParagraphs) {
    html = makeParagraphs(html);
  }

  var i = 0;
  html = html.replace(new RegExp('<(div|span)>'+label+'</\\1>', 'gm'), function() {
    return labels[i++];
  });

  return html;
}

module.exports = contextTypography;
