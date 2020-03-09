const sizeEnum = ["large", "max"];

const buildDatas = (args) => {
  var datas = "";

  if (args.length > 0) {
    args.forEach(item => {
      let kv = item.split("=");
      if (!kv[1]) {
        datas += `data-${kv[0]} `
      } else {
        datas += `data-${kv[0]}='${kv[1]}' `;
      }
    });
  }

  return datas;
}

const buildDatasObj = (args, defaultObj) => {
  let params = {};

  if (args.length > 0) {
    args.forEach(item => {
      let kv = item.split("=");
      params[kv[0]] = kv[1];
    });
  }

  return Object.assign({}, defaultObj, params);
}

/**
 * image tag
 *
 * Syntax:
 *   {% image { url title? size? } %}
 */
hexo.extend.tag.register("image", function(args) {
  let datas = buildDatasObj(args, { size: "", title: "" });

  if (!datas.url) return "";

  return `
    <figure class="figure-image ${datas.size}">
      <img src="${datas.url}" alt="${datas.title}" />
      <figcaption>${datas.title}</figcaption>
    </figure>
  `;
});

/**
 * bookmark tag
 *
 * Syntax:
 *   {% bookmark { link title? cover? } %}
 */
hexo.extend.tag.register("bookmark", function(args) {
  let datas = buildDatasObj(args, { title: "", cover: "" });

  if (!datas.link) return "";

  return `
    <figure class="bookmark-card">
      <a class="bookmark-container" target="_blank" title="${datas.title}" href="${datas.link}">
        <div class="bookmark-content">
          <div class="bookmark-name">${datas.title}</div>
          <div class="bookmark-link">${datas.link}</div>
        </div>
        <div class="bookmark-cover">
          <img src="${datas.cover || datas.link + '/favicon.ico'}" alt="${datas.title}" />
        </div>
      </a>
    </figure>
  `;
});

/**
 * aplayer tag
 *
 * Syntax:
 *   {% aplayer %}
 */
hexo.extend.tag.register("aplayer", function(args) {
  let datas = buildDatas(args);
  return `<div class="aplayer" ${datas}></div>`;
});

/**
 * dplayer tag
 *
 * Syntax:
 *   {% dplayer {url cover?} %}
 */
hexo.extend.tag.register("dplayer", function(args) {
  let datas = buildDatas(args);
  return `<div class="dplayer" ${datas}></div>`;
});

/** 
 * waterfall tag
 * 
 * Syntax:
 *  {% waterfall [size] %}
 *  ![img](img)...
 *  {% endwaterfall %}
 */
hexo.extend.tag.register("waterfall", function(args, content) {
  let datas = buildDatas(args);
  let datasObj = buildDatasObj(args, { size: "" });
  const text = hexo.render.renderSync({ text: content, engine: 'markdown' });
  return `<div class="waterfall-container ${datasObj.size}" ${datas}>${text}</div>`;
}, { ends: true });

/**
 * custom permalink
 * 
 * slug: YYYY-MM-DD-HH-mm-ss
 */
hexo.extend.filter.register('before_post_render', function(data) {
  if (!hexo.theme.config.permalink) return data
  if (data.layout === "post") {
    data.slug = data.date.format("YYYY-MM-DD-HH-mm-ss");
    return data
  }
});