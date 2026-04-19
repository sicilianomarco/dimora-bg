#!/bin/sh
# Commit all changes and push to GitHub (auto-deploys via GitHub Pages)
git add .
git commit -m "${1:-update}"
git push
