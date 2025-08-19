# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

URL Shortcut is a browser extension that allows users to create custom URL redirects using pattern matching. It supports Chrome, Safari, and Opera browsers. The extension intercepts web requests and redirects them based on user-configured patterns.

## Project Structure

- `Chrome/` - Chrome extension implementation (Manifest V2)
- `Safari/` - Safari extension implementation (.safariextension format)
- `Icons/` - Common icon assets

## Development Commands

This project has no build system, package.json, or automated tooling. It consists of static HTML, CSS, and JavaScript files that are directly loaded by browsers.

### Testing

Manual testing only - load the extension in browser developer mode:
- Chrome: Load unpacked extension from `Chrome/` folder
- Safari: Enable developer mode and load `Safari/URL-Shortcut.safariextension/`

## Architecture

### Chrome Extension (`Chrome/`)
- `manifest.json` - Extension configuration (Manifest V2, requires storage, webRequest permissions)
- `js/background.js` - Background script that handles URL interception and redirection
- `js/options.js` - Options page logic with RedirectController class for managing redirect rules
- `html/options.html` - Options UI for configuring redirects

### Core Logic
- Background script listens to `webRequest.onBeforeRequest` to intercept URLs
- Redirect patterns stored in `chrome.storage.sync`
- Supports exact URL matches and prefix-based pattern matching
- Options page provides dynamic UI for adding/removing redirect rules

### Safari Extension (`Safari/`)
- Similar functionality adapted for Safari's extension format
- `Info.plist` contains extension metadata and permissions
- Uses Safari's extension APIs instead of Chrome's webRequest API

## Extension Permissions

Chrome extension requires:
- `storage` - For saving redirect configurations
- `webRequest` + `webRequestBlocking` - For intercepting and redirecting requests
- `<all_urls>` - To match any URL pattern