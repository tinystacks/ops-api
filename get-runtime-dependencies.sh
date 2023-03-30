configJson=$(yq -o=json '.' store/example.yml 2> /dev/null);
deps=$(jq .Console.dependencies <<< $configJson 2> /dev/null);
depEntries=$(jq '. | to_entries' <<< $deps 2> /dev/null);
dependencies=$(jq -r '[.[].value] | unique | join(" ")' <<< $depEntries 2> /dev/null);
echo "$dependencies"