#!/bin/bash
cd /home/z/my-project
while true; do
  /usr/local/bin/bun next dev -p 3000 2>&1 | tee /home/z/my-project/dev.log
  echo "Process died, restarting in 3s..."
  sleep 3
done
