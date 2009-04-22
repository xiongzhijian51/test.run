use Module::Build::JSAN;

my $build = Module::Build::JSAN->new(
	module_name    => 'Test.Run',
	create_makefile_pl => 'passthrough',
	dist_version   => 0.01,
	dist_author   => 'SamuraiJack',
	dist_abstract  => 'Yet another JavaScript testing platform',
	license        => 'perl',
	
	components => [
	   'Test.Run.Result',
	   'Test.Run.Result.Diagnostic',
	   'Test.Run.Result.Assertion',
	   'Test.Run.Test',
	   'Test.Run.Harness',
	   'Test.Run.Harness.Browser',
	]
);

$build->create_build_script;

