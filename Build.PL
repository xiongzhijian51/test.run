use lib "$ENV{HOME}/Workspace/EclipseWorkspace/JSAN/module-build-jsan/lib";

use Module::Build::JSAN;

my $build = Module::Build::JSAN->new(

	module_name    => 'Test.Run',
	create_makefile_pl => 'passthrough',
	dist_version   => 0.01,
	dist_author   => 'SamuraiJack',
	dist_abstract  => 'Yet another JavaScript testing platform, running on Joose3 + bridge to ExtJS',
	license        => 'perl'
);

$build->create_build_script;

