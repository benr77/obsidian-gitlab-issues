
NPM = docker run -it --rm --name my-node-18 -v $(CURDIR):/usr/src/app -w /usr/src/app node:18-alpine npm

install:
	@${NPM} install

watch:
	@${NPM} run dev

build:
	@${NPM} run build

# Releasing a version
# https://publish.obsidian.md/hub/04+-+Guides%2C+Workflows%2C+%26+Courses/Guides/How+to+release+a+new+version+of+your+plugin
