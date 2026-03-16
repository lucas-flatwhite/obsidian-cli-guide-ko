/* ─────────────────────────────────────────
   app.js — Obsidian CLI Korean Guide
───────────────────────────────────────── */

const THEME_STORAGE_KEY = 'obsidian-cli-theme';
const LANG_STORAGE_KEY = 'obsidian-cli-lang';

const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');
const docUpdated = document.getElementById('docUpdated');
const toast = document.getElementById('toast');

let currentLang = 'ko';
let toastTimer = null;

const cache = {
  text: new WeakMap(),
  html: new WeakMap(),
  attrs: new WeakMap(),
  cmdDescByName: {},
  cmdGroupTitleHtml: new WeakMap(),
  codeComment: new WeakMap(),
  codeString: new WeakMap(),
};

const enStaticBindings = [
  { selector: 'title', type: 'text', en: 'Obsidian CLI — Korean Guide' },
  { selector: '#mainNav a[href="#overview"]', type: 'text', en: 'Overview' },
  { selector: '#mainNav a[href="#install"]', type: 'text', en: 'Install' },
  { selector: '#mainNav a[href="#examples"]', type: 'text', en: 'Examples' },
  { selector: '#mainNav a[href="#commands"]', type: 'text', en: 'Commands' },
  { selector: '#mainNav a[href="#shortcuts"]', type: 'text', en: 'Shortcuts' },
  { selector: '#mainNav a[href="#troubleshooting"]', type: 'text', en: 'Troubleshooting' },

  { selector: '.hero-title', type: 'html', en: 'Control Obsidian<br />Freely from Your Terminal' },
  {
    selector: '.hero-desc',
    type: 'html',
    en: 'Obsidian CLI is a command-line interface you can control directly from your terminal.<br />Use scripting, automation, and external tool integrations to maximize your note-taking productivity!'
  },
  {
    selector: '.hero-warning span:last-child',
    type: 'html',
    en: '<strong>Obsidian 1.12 installer</strong> or later is required. <a href="https://help.obsidian.md/Update+Obsidian" target="_blank" rel="noopener">Update guide →</a>'
  },

  { selector: '.feature-card h3', index: 0, type: 'text', en: 'Instant Execution' },
  {
    selector: '.feature-card p',
    index: 0,
    type: 'text',
    en: 'Create, search, edit, and move notes with a single command — control core Obsidian workflows from CLI.'
  },
  { selector: '.feature-card h3', index: 1, type: 'text', en: 'Automation & Scripting' },
  {
    selector: '.feature-card p',
    index: 1,
    type: 'text',
    en: 'Integrate with cron, shell scripts, and CI/CD pipelines to automate repetitive tasks.'
  },
  { selector: '.feature-card h3', index: 2, type: 'text', en: 'TUI Interface' },
  {
    selector: '.feature-card p',
    index: 2,
    type: 'text',
    en: 'Navigate quickly with a terminal UI that supports autocomplete, command history, and reverse search.'
  },
  { selector: '.feature-card h3', index: 3, type: 'text', en: 'Developer Tools' },
  {
    selector: '.feature-card p',
    index: 3,
    type: 'text',
    en: 'Speed up plugin development with plugin reload, screenshots, JavaScript eval, and DevTools toggles.'
  },

  { selector: '.section-label', index: 0, type: 'text', en: 'Getting Started' },
  { selector: '.section-title', index: 0, type: 'text', en: 'Installation' },
  { selector: '.section-desc', index: 0, type: 'text', en: 'Enabling Obsidian CLI takes just 3 steps.' },
  { selector: '.step-body h3', index: 0, type: 'text', en: 'Upgrade to the latest Obsidian version' },
  {
    selector: '.step-body p',
    index: 0,
    type: 'html',
    en: 'Upgrade to installer version <strong>1.12+</strong> (recommended: latest <strong>1.12.4+</strong>) and the latest early access build (1.12.x).'
  },
  { selector: '.step-body h3', index: 1, type: 'text', en: 'Enable CLI' },
  {
    selector: '.step-body p',
    index: 1,
    type: 'html',
    en: 'Enable <strong>Command line interface</strong> in <strong>Settings → General</strong>.'
  },
  { selector: '.step-body h3', index: 2, type: 'text', en: 'Register CLI' },
  {
    selector: '.step-body p',
    index: 2,
    type: 'text',
    en: 'Follow the on-screen instructions to register Obsidian CLI in your system, then restart your terminal.'
  },
  {
    selector: '.steps .os-content[data-os="mac"] .os-note',
    type: 'html',
    en: '<code>~/.zprofile</code> is updated with PATH automatically. If you use another shell (bash, fish), add it to that shell config file manually.'
  },
  {
    selector: '.steps .os-content[data-os="win"] .os-note',
    type: 'html',
    en: 'On Windows, an <code>Obsidian.com</code> terminal redirector is added to the install folder. It is included automatically in installer 1.12.4+.'
  },
  {
    selector: '.steps .os-content[data-os="linux"] .os-note',
    index: 0,
    type: 'html',
    en: '<strong>AppImage:</strong> A symlink is created at <code>/usr/local/bin/obsidian</code> (sudo required). If that fails, it is created at <code>~/.local/bin/obsidian</code>.'
  },
  {
    selector: '.steps .os-content[data-os="linux"] .os-note',
    index: 1,
    type: 'html',
    en: '<strong>Flatpak:</strong> Create a manual link to <code>~/.local/bin/obsidian</code>, then ensure <code>~/.local/bin</code> is in PATH.'
  },

  { selector: '.sub-title', type: 'text', en: 'Run your first command' },
  {
    selector: '.sub-desc',
    type: 'html',
    en: 'If CLI is installed, try it right away. The <strong>Obsidian app must be running</strong>.'
  },
  { selector: '.label-sm', index: 0, type: 'text', en: 'Single command' },
  { selector: '.label-sm', index: 1, type: 'text', en: 'Use TUI mode' },

  { selector: '.section-label', index: 1, type: 'text', en: 'Examples' },
  { selector: '.section-title', index: 1, type: 'text', en: 'Practical Use Cases' },
  {
    selector: '.section-desc',
    index: 1,
    type: 'text',
    en: 'From daily note workflows to developer automation, explore practical examples.'
  },
  { selector: '.ex-tab', index: 0, type: 'text', en: 'Daily Use' },
  { selector: '.ex-tab', index: 1, type: 'text', en: 'Developer' },
  { selector: '.ex-tab', index: 2, type: 'text', en: 'Automation' },

  { selector: '.section-label', index: 2, type: 'text', en: 'Usage' },
  { selector: '.section-title', index: 2, type: 'text', en: 'Parameters & Flags' },
  { selector: '.section-desc', index: 2, type: 'html', en: 'Commands use <strong>parameters</strong> and <strong>flags</strong>.' },
  { selector: '.param-card h3', index: 0, type: 'text', en: 'Parameters with values' },
  {
    selector: '.param-card > p',
    index: 0,
    type: 'html',
    en: 'Use the <code>parameter=value</code> format. Wrap values with spaces in quotes.'
  },
  { selector: '.param-card h3', index: 1, type: 'text', en: 'Boolean flags' },
  {
    selector: '.param-card > p',
    index: 1,
    type: 'text',
    en: 'Switches used without a value. Include them to enable behavior.'
  },
  { selector: '.param-card h3', index: 2, type: 'text', en: 'Target a vault' },
  {
    selector: '.param-card > p',
    index: 2,
    type: 'html',
    en: 'Prefix a command with <code>vault=&lt;name&gt;</code> or <code>vault=&lt;id&gt;</code> to target a specific vault.'
  },
  { selector: '.param-card h3', index: 3, type: 'text', en: 'Target a file' },
  {
    selector: '.param-card > p',
    index: 3,
    type: 'html',
    en: 'Use <code>file=&lt;filename&gt;</code> or <code>path=&lt;path&gt;</code> to target a file. <code>file</code> matches a filename, while <code>path</code> uses a vault-relative path.'
  },
  { selector: '.param-card h3', index: 4, type: 'text', en: 'Copy output' },
  {
    selector: '.param-card > p',
    index: 4,
    type: 'html',
    en: 'Add <code>--copy</code> to any command to copy output to clipboard.'
  },

  { selector: '.section-label', index: 3, type: 'text', en: 'Command Reference' },
  { selector: '.section-title', index: 3, type: 'text', en: 'All Commands' },
  { selector: '.section-desc', index: 3, type: 'text', en: 'Browse by category and search quickly.' },
  {
    selector: '#cmdSearch',
    type: 'attr',
    attr: 'placeholder',
    en: 'Search commands... (e.g., daily, search, sync)'
  },
  { selector: '#noResult p', type: 'text', en: 'No matching commands found.' },

  { selector: '.section-label', index: 4, type: 'text', en: 'TUI Shortcuts' },
  { selector: '.section-title', index: 4, type: 'text', en: 'Keyboard Shortcuts' },
  { selector: '.section-desc', index: 4, type: 'text', en: 'All shortcuts available in TUI mode.' },

  { selector: '#shortcuts .shortcut-group h3', index: 0, type: 'text', en: 'Navigation' },
  { selector: '#shortcuts .shortcut-group h3', index: 1, type: 'text', en: 'Editing' },
  { selector: '#shortcuts .shortcut-group h3', index: 2, type: 'text', en: 'Autocomplete' },
  { selector: '#shortcuts .shortcut-group h3', index: 3, type: 'text', en: 'History' },
  { selector: '#shortcuts .shortcut-group h3', index: 4, type: 'text', en: 'Other' },

  { selector: '#shortcuts .shortcut-group:nth-child(1) tr:nth-child(1) td:first-child', type: 'text', en: 'Cursor left' },
  { selector: '#shortcuts .shortcut-group:nth-child(1) tr:nth-child(2) td:first-child', type: 'text', en: 'Cursor right' },
  { selector: '#shortcuts .shortcut-group:nth-child(1) tr:nth-child(3) td:first-child', type: 'text', en: 'Beginning of line' },
  { selector: '#shortcuts .shortcut-group:nth-child(1) tr:nth-child(4) td:first-child', type: 'text', en: 'End of line' },
  { selector: '#shortcuts .shortcut-group:nth-child(1) tr:nth-child(5) td:first-child', type: 'text', en: 'Back one word' },
  { selector: '#shortcuts .shortcut-group:nth-child(1) tr:nth-child(6) td:first-child', type: 'text', en: 'Forward one word' },

  { selector: '#shortcuts .shortcut-group:nth-child(2) tr:nth-child(1) td:first-child', type: 'text', en: 'Delete to beginning of line' },
  { selector: '#shortcuts .shortcut-group:nth-child(2) tr:nth-child(2) td:first-child', type: 'text', en: 'Delete to end of line' },
  { selector: '#shortcuts .shortcut-group:nth-child(2) tr:nth-child(3) td:first-child', type: 'text', en: 'Delete previous word' },

  { selector: '#shortcuts .shortcut-group:nth-child(3) tr:nth-child(1) td:first-child', type: 'text', en: 'Enter/accept suggestion mode' },
  { selector: '#shortcuts .shortcut-group:nth-child(3) tr:nth-child(2) td:first-child', type: 'text', en: 'Exit suggestion mode' },
  { selector: '#shortcuts .shortcut-group:nth-child(3) tr:nth-child(3) td:first-child', type: 'text', en: 'Enter suggestion mode from empty input' },
  { selector: '#shortcuts .shortcut-group:nth-child(3) tr:nth-child(4) td:first-child', type: 'text', en: 'Accept first/selected suggestion' },

  { selector: '#shortcuts .shortcut-group:nth-child(4) tr:nth-child(1) td:first-child', type: 'text', en: 'Previous history / suggestion up' },
  { selector: '#shortcuts .shortcut-group:nth-child(4) tr:nth-child(2) td:first-child', type: 'text', en: 'Next history / suggestion down' },
  { selector: '#shortcuts .shortcut-group:nth-child(4) tr:nth-child(3) td:first-child', type: 'text', en: 'Reverse search (repeat: Ctrl+R)' },

  { selector: '#shortcuts .shortcut-group:nth-child(5) tr:nth-child(1) td:first-child', type: 'text', en: 'Run command / accept suggestion' },
  { selector: '#shortcuts .shortcut-group:nth-child(5) tr:nth-child(2) td:first-child', type: 'text', en: 'Cancel autocomplete / exit suggestions / clear input' },
  { selector: '#shortcuts .shortcut-group:nth-child(5) tr:nth-child(3) td:first-child', type: 'text', en: 'Clear screen' },
  { selector: '#shortcuts .shortcut-group:nth-child(5) tr:nth-child(4) td:first-child', type: 'text', en: 'Exit' },

  { selector: '.section-label', index: 5, type: 'text', en: 'Troubleshooting' },
  { selector: '.section-title', index: 5, type: 'text', en: 'Troubleshooting' },
  { selector: '.section-desc', index: 5, type: 'text', en: 'If CLI execution fails, check the items below.' },

  { selector: '.trouble-item h3', index: 0, type: 'text', en: 'Basic checklist' },
  { selector: '.trouble-item ul li', index: 0, type: 'html', en: 'Verify you are using the latest Obsidian installer (recommended: <strong>1.12.4+</strong>)' },
  { selector: '.trouble-item ul li', index: 1, type: 'html', en: 'Restart your terminal after CLI registration' },
  { selector: '.trouble-item ul li', index: 2, type: 'html', en: 'Make sure Obsidian is running (<strong>the first command launches the app</strong>)' },

  { selector: '.trouble-item h3', index: 1, type: 'text', en: 'Windows' },
  {
    selector: '.trouble-item p',
    index: 0,
    type: 'html',
    en: 'Installer 1.12.4+ is required. The <code>Obsidian.com</code> terminal redirector is added to the same folder as <code>Obsidian.exe</code>.'
  },

  { selector: '.trouble-item h3', index: 2, type: 'text', en: 'macOS' },
  {
    selector: '.trouble-item p',
    index: 1,
    type: 'html',
    en: 'Check whether the line below exists in <code>~/.zprofile</code>. If not, add it manually.'
  },
  {
    selector: '.trouble-item .os-note',
    index: 0,
    type: 'text',
    en: 'If you use another shell (bash, fish), add it to that shell config file as well.'
  },

  { selector: '.trouble-item h3', index: 3, type: 'text', en: 'Linux' },
  {
    selector: '.trouble-item p',
    index: 2,
    type: 'html',
    en: '<strong>AppImage:</strong> Check symlink: <code>ls -l /usr/local/bin/obsidian</code>'
  },
  {
    selector: '.trouble-item p',
    index: 3,
    type: 'html',
    en: '<strong>Flatpak:</strong> Create the link below and add <code>~/.local/bin</code> to PATH.'
  },
  {
    selector: '.trouble-item .os-note',
    index: 1,
    type: 'html',
    en: 'When using Snap, you may need to set <code>XDG_CONFIG_HOME="$HOME/snap/obsidian/current/.config"</code>.'
  },

  { selector: '.footer-left span:last-child', type: 'text', en: 'Obsidian CLI Korean Guide' },
  { selector: '.footer-right a:first-child', type: 'text', en: 'Official docs →' },
];

const enCmdGroupTitles = [
  'General',
  'Bases',
  'Files & Folders',
  'Daily Notes',
  'Search',
  'Tasks',
  'Tags',
  'Links',
  'File History',
  'Plugins',
  'Sync',
  'Properties',
  'Publish',
  'Developer',
  'Vault & Workspace',
  'Themes & Snippets',
  'Miscellaneous'
];

const enCommandDescriptions = {
  help: 'Show all commands. Use <code>help &lt;command&gt;</code> to view help for a specific command.',
  version: 'Show Obsidian version.',
  reload: 'Reload the app window.',
  restart: 'Restart the app.',
  bases: 'List bases in the vault.',
  'base:views': 'List views in a base. <code>file=&lt;base-file&gt;</code> (required)',
  'base:create': 'Create a new record in a base. <code>file=&lt;base-file&gt;</code> <code>view=&lt;name&gt;</code>',
  'base:query': 'Run a base view query. <code>file=&lt;base-file&gt;</code> <code>view=&lt;name&gt;</code> <code>query=&lt;text&gt;</code>',
  file: 'Get file info (default: active file). <code>file=&lt;name&gt;</code>, <code>path=&lt;path&gt;</code>',
  files: 'List files in the vault. <code>folder=&lt;path&gt;</code> <code>ext=&lt;extension&gt;</code> <code>total</code>',
  folder: 'Get folder info. <code>path=&lt;path&gt;</code> (required)',
  folders: 'List folders in the vault.',
  open: 'Open a file. <code>file=&lt;name&gt;</code> <code>newtab</code>',
  create: 'Create or overwrite a file. <code>name</code> <code>content</code> <code>template</code> <code>overwrite</code> <code>open</code>',
  read: 'Read file contents (default: active file).',
  append: 'Append content to the end of a file. <code>content=&lt;text&gt;</code> (required) <code>inline</code>',
  prepend: 'Insert content after frontmatter. <code>content=&lt;text&gt;</code> (required)',
  move: 'Move/rename a file. <code>to=&lt;path&gt;</code> (required). Internal links are updated automatically.',
  rename: 'Rename a file. <code>name=&lt;name&gt;</code> (required). File extension is preserved automatically.',
  delete: 'Delete a file (default: trash). Use <code>permanent</code> for permanent deletion.',
  daily: 'Open daily note. <code>paneType=tab|split|window</code>',
  'daily:path': 'Get daily note path (returns even if not created yet).',
  'daily:read': 'Read daily note contents.',
  'daily:append': 'Append content to daily note. <code>content=&lt;text&gt;</code> (required)',
  'daily:prepend': 'Prepend content to daily note. <code>content=&lt;text&gt;</code> (required)',
  search: 'Search vault text and return matching file paths. <code>query=&lt;text&gt;</code> (required) <code>limit</code> <code>format=text|json</code>',
  'search:context': 'Search with context. Outputs grep-style <code>path:line: text</code>.',
  'search:open': 'Open search view. Set initial query with <code>query=&lt;text&gt;</code>.',
  tasks: 'List tasks in the vault. <code>todo</code> <code>done</code> <code>daily</code> <code>verbose</code> <code>format=json|tsv|csv</code>',
  task: 'Inspect or update a task. <code>toggle</code> <code>done</code> <code>todo</code> <code>status=&lt;char&gt;</code>',
  tags: 'List vault tags. <code>sort=count</code> <code>counts</code> <code>total</code> <code>active</code>',
  tag: 'Show tag info. <code>name=&lt;tag&gt;</code> (required) <code>verbose</code>',
  backlinks: 'List backlinks for a file (default: active file).',
  links: 'List outgoing links for a file.',
  unresolved: 'List unresolved links in the vault.',
  orphans: 'List files with no incoming links.',
  deadends: 'List files with no outgoing links.',
  diff: 'Compare file versions. <code>from=&lt;n&gt;</code> <code>to=&lt;n&gt;</code> <code>filter=local|sync</code>',
  history: 'View file history.',
  'history:list': 'List file history versions.',
  'history:read': 'Read a specific local history version. <code>version=&lt;n&gt;</code>',
  'history:restore': 'Restore a local history version. <code>version=&lt;n&gt;</code> (required)',
  'history:open': 'Open File recovery view. <code>file=&lt;name&gt;</code> <code>path=&lt;path&gt;</code>',
  plugins: 'List installed plugins. <code>filter=core|community</code> <code>versions</code>',
  'plugins:enabled': 'List enabled plugins.',
  'plugins:restrict': 'Get/set restricted mode. <code>on</code> <code>off</code>',
  plugin: 'Show plugin info. <code>id=&lt;id&gt;</code> (required)',
  'plugin:enable': 'Enable plugin. <code>id=&lt;id&gt;</code> (required)',
  'plugin:disable': 'Disable plugin. <code>id=&lt;id&gt;</code> (required)',
  'plugin:install': 'Install community plugin. <code>id=&lt;id&gt;</code> (required) <code>enable</code>',
  'plugin:uninstall': 'Uninstall community plugin. <code>id=&lt;id&gt;</code> (required)',
  'plugin:reload': 'Reload plugin (developer). <code>id=&lt;id&gt;</code> (required)',
  sync: 'Pause/resume sync. <code>on</code> <code>off</code>',
  'sync:status': 'Show sync status and usage.',
  'sync:history': 'List sync version history.',
  'sync:read': 'Read a sync version (default: active file). <code>file=&lt;name&gt;</code> <code>path=&lt;path&gt;</code> <code>version=&lt;n&gt;</code> (required)',
  'sync:restore': 'Restore a sync version. <code>version=&lt;n&gt;</code> (required)',
  'sync:open': 'Open sync history (default: active file). <code>file=&lt;name&gt;</code> <code>path=&lt;path&gt;</code>',
  'sync:deleted': 'List files deleted from Sync.',
  properties: 'List properties for vault or file. <code>format=yaml|json|tsv</code>',
  aliases: 'List aliases in the vault. Use <code>active</code> or <code>file</code>/<code>path</code> for a specific file, plus <code>total</code> <code>verbose</code>.',
  'property:set': 'Set a property on a file. <code>name</code> <code>value</code> <code>type</code> (required)',
  'property:read': 'Read a property value. <code>name=&lt;name&gt;</code> (required)',
  'property:remove': 'Remove a property. <code>name=&lt;name&gt;</code> (required)',
  'publish:site': 'Show publish site info (slug, URL).',
  'publish:list': 'List published files.',
  'publish:status': 'Show publish changes. <code>new</code> <code>changed</code> <code>deleted</code>',
  'publish:add': 'Publish files. Use <code>changed</code> to publish all changed files at once.',
  'publish:remove': 'Unpublish files.',
  'publish:open': 'Open published file on site.',
  devtools: 'Toggle Electron DevTools.',
  'dev:debug': 'Toggle debug mode. <code>on</code> <code>off</code>',
  'dev:cdp': 'Run a Chrome DevTools Protocol request. <code>method=&lt;name&gt;</code> <code>params=&lt;json&gt;</code>',
  eval: 'Run JavaScript and return result. <code>code=&lt;javascript&gt;</code> (required)',
  'dev:screenshot': 'Take a screenshot (returns base64 PNG). <code>path=&lt;filename&gt;</code>',
  'dev:console': 'Show captured console messages. <code>level=log|warn|error|info|debug</code> <code>limit=&lt;n&gt;</code>',
  'dev:errors': 'Show captured JS errors. <code>clear</code>',
  'dev:css': 'Inspect with CSS source locations. <code>selector=&lt;css&gt;</code> (required)',
  'dev:dom': 'Query DOM elements. <code>selector=&lt;css&gt;</code> (required)',
  'dev:mobile': 'Toggle mobile emulation. <code>on</code> <code>off</code>',
  vault: 'Show vault info. <code>info=name|path|files|folders|size</code>',
  vaults: 'List known vaults.',
  'vault:open': 'Switch to another vault (TUI only). <code>name=&lt;name&gt;</code> (required)',
  workspace: 'Show workspace tree.',
  workspaces: 'List saved workspaces.',
  'workspace:save': 'Save current layout as workspace.',
  'workspace:load': 'Load saved workspace.',
  'workspace:delete': 'Delete workspace. <code>name=&lt;workspace&gt;</code> (required)',
  tabs: 'List open tabs.',
  'tab:open': 'Open a new tab. <code>group=&lt;id&gt;</code> <code>file=&lt;path&gt;</code> <code>view=&lt;type&gt;</code>',
  recents: 'List recently opened files.',
  themes: 'List installed themes.',
  theme: 'Show current theme info.',
  'theme:set': 'Set theme. <code>name=&lt;name&gt;</code> (required)',
  'theme:install': 'Install community theme. <code>name=&lt;name&gt;</code> <code>enable</code>',
  'theme:uninstall': 'Uninstall community theme. <code>name=&lt;name&gt;</code> (required)',
  snippets: 'List installed CSS snippets.',
  'snippets:enabled': 'List enabled CSS snippets.',
  'snippet:enable': 'Enable CSS snippet. <code>name=&lt;name&gt;</code> (required)',
  'snippet:disable': 'Disable CSS snippet. <code>name=&lt;name&gt;</code> (required)',
  commands: 'List available command palette IDs.',
  command: 'Run an Obsidian command. <code>id=&lt;command-id&gt;</code> (required)',
  hotkeys: 'List hotkeys.',
  hotkey: 'Show hotkeys for a command. <code>id=&lt;command-id&gt;</code> (required)',
  random: 'Open a random note. <code>folder=&lt;path&gt;</code>',
  'random:read': 'Read a random note.',
  wordcount: 'Count words/characters. <code>words</code> <code>characters</code>',
  outline: 'Show headings of the current file. <code>format=tree|md|json</code>',
  bookmarks: 'List bookmarks. <code>total</code> <code>verbose</code> <code>format=json|tsv|csv</code>',
  bookmark: 'Add bookmark. <code>file</code> <code>subpath</code> <code>folder</code> <code>search</code> <code>url</code> <code>title</code>',
  web: 'Open URL in web viewer. <code>url=&lt;url&gt;</code> (required)',
  unique: 'Create a unique note.',
  templates: 'List templates.',
  'template:read': 'Read template content. <code>name=&lt;template&gt;</code> (required)',
  'template:insert': 'Insert template into active file. <code>name=&lt;template&gt;</code> (required)',
};

const enCodeComments = {
  '# 오늘의 데일리 노트 열기': '# Open today\'s daily note',
  '# vault 전체에서 검색': '# Search across the whole vault',
  '# 데일리 노트에 할 일 추가': '# Append a task to daily note',
  '# 도움말 보기': '# Show help',
  '# TUI 열기 (자동완성 지원)': '# Open TUI (with autocomplete)',
  '# 오늘 데일리 노트 열기': '# Open today\'s daily note',
  '# vault 검색': '# Search the vault',
  '# 현재 파일 읽기': '# Read current file',
  '# 데일리 노트의 모든 태스크 나열': '# List all tasks in daily note',
  '# 템플릿으로 새 노트 생성': '# Create a new note from template',
  '# vault의 모든 태그와 빈도 보기': '# Show all tags in vault with counts',
  '# 파일 두 버전 비교': '# Compare two file versions',
  '# 개발자 도구 열기': '# Open developer tools',
  '# 개발 중인 플러그인 리로드': '# Reload plugin under development',
  '# 앱 스크린샷 촬영': '# Capture app screenshot',
  '# 앱 콘솔에서 JavaScript 실행': '# Run JavaScript in app console',
  '# JS 에러 목록 확인': '# Check JS error list',
  '# CSS 속성 검사': '# Inspect CSS properties',
  '# DOM 쿼리': '# Query DOM',
  '# 매일 아침 루틴: 데일리 노트 준비 스크립트': '# Morning routine: daily note prep script',
  '# 데일리 노트 생성 및 열기': '# Create and open daily note',
  '# 고정 태스크 목록 추가': '# Add fixed task checklist',
  '# 최근 수정 파일 목록 클립보드에 복사': '# Copy recently modified files to clipboard',
  '# 미해결 링크 확인': '# Check unresolved links',
  '# 특정 vault에서 검색 후 결과를 파일로 저장': '# Search a specific vault and save results to a file',
  '# 심볼릭 링크 수동 생성': '# Create symlink manually',
  '# ~/.local/bin 에 생성된 경우, PATH에 추가': '# If created in ~/.local/bin, add it to PATH'
};

const enCodeStrings = {
  '"## 오늘의 루틴\\n- [ ] 이메일 확인\\n- [ ] 스탠드업 미팅\\n- [ ] 코드 리뷰"':
    '"## Today\'s routine\\n- [ ] Check email\\n- [ ] Stand-up meeting\\n- [ ] Code review"'
};

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'ko' || saved === 'en') return saved;
  } catch (_) {}

  const language = (navigator.language || '').toLowerCase();
  return language.startsWith('ko') ? 'ko' : 'en';
}

function getThemeLabel(theme, lang) {
  if (lang === 'en') return theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
  return theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환';
}

function getLanguageLabel(lang) {
  return lang === 'en' ? 'Switch to Korean' : '영어로 전환';
}

function getNavToggleLabel(isOpen, lang) {
  if (lang === 'en') return isOpen ? 'Close menu' : 'Open menu';
  return isOpen ? '메뉴 닫기' : '메뉴 열기';
}

function getCopyLabel(lang) {
  return lang === 'en' ? 'Copy' : '복사';
}

function getToastLabel(lang) {
  return lang === 'en' ? 'Copied to clipboard ✓' : '클립보드에 복사되었습니다 ✓';
}

function getUpdatedLabel(lang, dateText) {
  return lang === 'en' ? `Last updated: ${dateText}` : `최종 갱신: ${dateText}`;
}

function getElement(binding) {
  const nodes = document.querySelectorAll(binding.selector);
  const index = binding.index ?? 0;
  return nodes[index] || null;
}

function localizeBinding(binding, lang) {
  const el = getElement(binding);
  if (!el) return;

  if (binding.type === 'attr') {
    const attrs = cache.attrs.get(el) || {};
    if (!(binding.attr in attrs)) attrs[binding.attr] = el.getAttribute(binding.attr) || '';
    cache.attrs.set(el, attrs);

    if (lang === 'en') el.setAttribute(binding.attr, binding.en);
    else el.setAttribute(binding.attr, attrs[binding.attr]);
    return;
  }

  if (binding.type === 'html') {
    if (!cache.html.has(el)) cache.html.set(el, el.innerHTML);
    el.innerHTML = lang === 'en' ? binding.en : cache.html.get(el);
    return;
  }

  if (!cache.text.has(el)) cache.text.set(el, el.textContent || '');
  el.textContent = lang === 'en' ? binding.en : cache.text.get(el);
}

function applyCommandGroupTitles(lang) {
  const titles = document.querySelectorAll('.cmd-group-title');
  titles.forEach((titleEl, idx) => {
    if (!cache.cmdGroupTitleHtml.has(titleEl)) cache.cmdGroupTitleHtml.set(titleEl, titleEl.innerHTML);

    if (lang === 'en') {
      const icon = titleEl.querySelector('span:first-child')?.textContent || '';
      const label = enCmdGroupTitles[idx] || '';
      titleEl.innerHTML = `<span>${icon}</span> ${label}`;
    } else {
      titleEl.innerHTML = cache.cmdGroupTitleHtml.get(titleEl);
    }
  });
}

function applyCommandDescriptions(lang) {
  document.querySelectorAll('.cmd-item').forEach(item => {
    const name = item.dataset.name;
    const descEl = item.querySelector('.cmd-desc');
    if (!name || !descEl) return;

    if (!cache.cmdDescByName[name]) cache.cmdDescByName[name] = descEl.innerHTML;

    if (lang === 'en') {
      descEl.innerHTML = enCommandDescriptions[name] || cache.cmdDescByName[name];
    } else {
      descEl.innerHTML = cache.cmdDescByName[name];
    }
  });
}

function applyCodeCommentTranslations(lang) {
  document.querySelectorAll('.cm-comment').forEach(el => {
    if (!cache.codeComment.has(el)) cache.codeComment.set(el, el.textContent || '');
    const original = cache.codeComment.get(el) || '';
    const key = original.trim();

    if (lang === 'en' && enCodeComments[key]) {
      el.textContent = enCodeComments[key];
    } else {
      el.textContent = original;
    }
  });
}

function applyCodeStringTranslations(lang) {
  document.querySelectorAll('.cm-str').forEach(el => {
    if (!cache.codeString.has(el)) cache.codeString.set(el, el.textContent || '');
    const original = cache.codeString.get(el) || '';
    const key = original.trim();

    if (lang === 'en' && enCodeStrings[key]) {
      el.textContent = enCodeStrings[key];
    } else {
      el.textContent = original;
    }
  });
}

function updateUiStateByLanguage(lang) {
  const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  const isMenuOpen = mainNav?.classList.contains('open') || false;

  if (themeToggle) {
    const isLight = theme === 'light';
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', getThemeLabel(theme, lang));

    const thumb = themeToggle.querySelector('.theme-toggle-thumb');
    if (thumb) thumb.textContent = isLight ? '☀' : '☾';
  }

  if (langToggle) {
    const isEnglish = lang === 'en';
    langToggle.setAttribute('aria-pressed', String(isEnglish));
    langToggle.setAttribute('aria-label', getLanguageLabel(lang));

    const thumb = langToggle.querySelector('.lang-toggle-thumb');
    if (thumb) thumb.textContent = isEnglish ? 'EN' : 'KO';
  }

  if (navToggle) navToggle.setAttribute('aria-label', getNavToggleLabel(isMenuOpen, lang));

  if (toast) toast.textContent = getToastLabel(lang);

  if (docUpdated) {
    const dateText = docUpdated.dataset.updated || '';
    docUpdated.textContent = getUpdatedLabel(lang, dateText);
  }

  document.querySelectorAll('.copy-btn').forEach(btn => {
    if (btn.textContent !== '✓') btn.textContent = getCopyLabel(lang);
  });
}

function applyLanguage(lang) {
  currentLang = lang === 'en' ? 'en' : 'ko';
  document.documentElement.lang = currentLang;

  enStaticBindings.forEach(binding => localizeBinding(binding, currentLang));
  applyCommandGroupTitles(currentLang);
  applyCommandDescriptions(currentLang);
  applyCodeCommentTranslations(currentLang);
  applyCodeStringTranslations(currentLang);
  updateUiStateByLanguage(currentLang);

  try {
    localStorage.setItem(LANG_STORAGE_KEY, currentLang);
  } catch (_) {}
}

function applyTheme(theme) {
  const nextTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  updateUiStateByLanguage(currentLang);
}

function showToast() {
  if (!toast) return;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

const initialLanguage = getInitialLanguage();
applyLanguage(initialLanguage);

const initialTheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
applyTheme(initialTheme);

langToggle?.addEventListener('click', () => {
  const next = currentLang === 'ko' ? 'en' : 'ko';
  applyLanguage(next);
});

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch (_) {}
});

navToggle?.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  const isOpen = mainNav.classList.contains('open');
  navToggle.setAttribute('aria-label', getNavToggleLabel(isOpen, currentLang));
});

// Close nav when a link is clicked
mainNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    if (navToggle) navToggle.setAttribute('aria-label', getNavToggleLabel(false, currentLang));
  });
});

/* ── OS Tabs (install section) ── */
document.querySelectorAll('.os-tabs').forEach(tabGroup => {
  const tabs = tabGroup.querySelectorAll('.os-tab');
  const contents = tabGroup.closest('.step-body').querySelectorAll('.os-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      contents.forEach(c => {
        c.classList.toggle('active', c.dataset.os === target);
      });
    });
  });
});

/* ── Example tabs ── */
document.querySelectorAll('.ex-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ex-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.ex-panel').forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    const panel = document.getElementById(`ex-${tab.dataset.ex}`);
    panel?.classList.add('active');
  });
});

/* ── Copy buttons ── */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    let text = '';

    if (targetId) {
      const el = document.getElementById(targetId);
      text = el ? el.innerText : '';
    } else {
      // Fallback: copy code in the same block
      const pre = btn.closest('.code-block-wrap, .hero-code-wrap')?.querySelector('pre, .hero-code');
      text = pre ? pre.innerText : '';
    }

    navigator.clipboard.writeText(text.trim()).then(() => {
      showToast();
      btn.textContent = '✓';
      setTimeout(() => (btn.textContent = getCopyLabel(currentLang)), 1800);
    });
  });
});

/* ── Command search ── */
const cmdSearch = document.getElementById('cmdSearch');
const noResult = document.getElementById('noResult');
const allGroups = document.querySelectorAll('.cmd-group');

cmdSearch?.addEventListener('input', () => {
  const query = cmdSearch.value.trim().toLowerCase();

  if (!query) {
    allGroups.forEach(g => {
      g.style.display = '';
      g.querySelectorAll('.cmd-item').forEach(i => (i.style.display = ''));
    });
    if (noResult) noResult.style.display = 'none';
    return;
  }

  let totalVisible = 0;

  allGroups.forEach(group => {
    const items = group.querySelectorAll('.cmd-item');
    let groupVisible = 0;

    items.forEach(item => {
      const name = item.dataset.name || '';
      const text = item.innerText.toLowerCase();
      const match = name.includes(query) || text.includes(query);
      item.style.display = match ? '' : 'none';
      if (match) groupVisible++;
    });

    group.style.display = groupVisible > 0 ? '' : 'none';
    if (groupVisible > 0) group.setAttribute('open', '');
    totalVisible += groupVisible;
  });

  if (noResult) noResult.style.display = totalVisible === 0 ? 'block' : 'none';
});

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id], div[id="params"]');
const navLinks = document.querySelectorAll('.main-nav a');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--text-primary)';
          }
        });
      }
    });
  },
  { rootMargin: '-20% 0px -70% 0px' }
);

sections.forEach(s => observer.observe(s));

/* ── Smooth scroll for anchors ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
