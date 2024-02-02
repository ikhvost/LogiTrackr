# common config
SHELL = bash
MAKEFLAGS += --no-print-directory

# help
.PHONY: help

help: ## Show this help
help: _cmd_prefix= [^_]+
help: _help

_help:
	@fgrep -h "##" $(MAKEFILE_LIST) | sed -e 's/\(\:.*\#\#\)/\:\ /' | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

_assert-tools: # check if given TOOLS is available
	@for TOOL in $(TOOLS); do \
		type $$TOOL &> /dev/null || (echo -e "Please install '$$TOOL' and run the command again.\n"; exit 1); \
	done

# include nested makefiles
include ./*/*.mk
include ./packages/*/*.mk

# leave the empty line at end of file for autocomplete to work
