#!/bin/bash
git branch --merged master | grep -v "\* master" | xargs -n 1 git branch -d
git branch -r --merged | grep -v master | sed 's/origin\///' | xargs -n 1 git push --delete origin
