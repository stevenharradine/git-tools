#!/bin/bash
FILES=/home/douglas/Repositories/*

for file in $FILES
do
if [[ "$file" != *\.* ]]
then
  echo $file
  cd $file
  if [ -f "$file/.travis.yml" ]; then
#    echo "File $file exists."
#  else
    echo "File $file does not exist."
  fi
fi
done
