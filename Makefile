
install:
	@npm install

watch:
	@npm run dev

build:
	@npm run build

# https://publish.obsidian.md/hub/04+-+Guides%2C+Workflows%2C+%26+Courses/Guides/How+to+release+a+new+version+of+your+plugin
release:
	@npm run release
	@echo -e "\nIf you are happy, run \"git push --follow-tags origin main\" to publish the new release"
